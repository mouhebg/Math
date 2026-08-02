import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const worksheetDirectory = join(process.cwd(), 'public', 'worksheets');
const worksheetFiles = readdirSync(worksheetDirectory)
  .filter((name) => /^mathnest-unit-\d{2}-session-[ab]\.html$/.test(name))
  .sort();

const answerStyles = `
/* Inline answer reveal */
.inline-answer-value{
  display:none;
  color:#16865f;
  font-weight:800;
  font-family:'Space Mono',monospace;
}
body.answers-visible .inline-answer-value{display:inline-block;}
.pw .inline-answer-value,.vsum .inline-answer-value{font-size:inherit;}
.clockwrap .ansline .inline-answer-value{padding-top:1px;}
.inline-answer-card{
  display:none;
  margin-top:10px;
  padding:9px 12px;
  border:1.5px solid #16865f;
  border-left-width:5px;
  background:#e7f5ed;
  color:#126a4d;
  font-family:'Space Mono',monospace;
  font-size:12px;
  line-height:1.55;
}
.inline-answer-card strong{
  display:block;
  margin-bottom:2px;
  color:#16865f;
  font-size:10px;
  letter-spacing:.12em;
  text-transform:uppercase;
}
body.answers-visible .inline-answer-card{display:block;}
body.answers-visible .bl{border-bottom-color:#16865f;}
body.answers-visible .pw .top:has(.inline-answer-value),
body.answers-visible .pw .bot div:has(.inline-answer-value){background:#e7f5ed;border-color:#16865f;}
@media print{
  body.answers-visible .inline-answer-value,body.answers-visible .inline-answer-card{color:#16865f!important;}
}
`;

const answerScript = `
 var showing=false,toggle=document.getElementById('answers-toggle');

 function parseAnswerGroups(){
  var source=document.querySelector('.answers'),groups={},current=null;
  if(!source){return groups;}
  Array.prototype.forEach.call(source.childNodes,function(node){
   if(node.nodeType===1&&node.tagName==='B'){
    current=(node.textContent.match(/\\d+/)||[])[0]||null;
    if(current){groups[current]='';}
   }else if(current){
    groups[current]+=' '+(node.textContent||'');
   }
  });
  Object.keys(groups).forEach(function(key){groups[key]=groups[key].replace(/\\s+/g,' ').trim();});
  source.setAttribute('aria-hidden','true');
  return groups;
 }

 function cleanChunk(value){
  return value.replace(/^[a-h]\\s+/i,'').replace(/\\s+/g,' ').trim();
 }

 function answerVariants(answer){
  var variants=[];
  var chunks=answer.split(/[;,]/).map(cleanChunk).filter(Boolean);
  var slashChunks=answer.split(/[;,/]/).map(cleanChunk).filter(Boolean);
  var mathTokens=answer.match(/\\$?\\d+(?::\\d{2})?(?:\\.\\d+)?(?:½)?(?:c)?|½|[<>=]|minus|plus|whole|part|yes|no|odd|even|true|false/gi)||[];
  var clockLines=[];
  chunks.forEach(function(chunk){
   var match=chunk.match(/^(\\d{1,2}:\\d{2})\\s+(.+)$/);
   if(match){clockLines.push(match[1],match[2]);}
  });
  [chunks,slashChunks,mathTokens,clockLines].forEach(function(items){
   if(items.length&&!variants.some(function(existing){return existing.join('|')===items.join('|');})){variants.push(items);}
  });
  return variants;
 }

 function emptyElements(exercise,selector){
  return Array.prototype.filter.call(exercise.querySelectorAll(selector),function(element){
   return !element.textContent.trim();
  });
 }

 function addAnswerValue(target,value){
  var span=document.createElement('span');
  span.className='inline-answer-value';
  span.textContent=value;
  span.setAttribute('aria-hidden','true');
  target.appendChild(span);
 }

 function addAnswerCard(exercise,answer){
  var card=document.createElement('div'),label=document.createElement('strong'),value=document.createElement('span');
  card.className='inline-answer-card';
  card.setAttribute('aria-hidden','true');
  label.textContent='Answer';
  value.textContent=answer;
  card.appendChild(label);
  card.appendChild(value);
  exercise.appendChild(card);
 }

 var answerGroups=parseAnswerGroups();
 Array.prototype.forEach.call(document.querySelectorAll('.ex'),function(exercise,index){
  var numberNode=exercise.querySelector('.ex-t .n');
  var number=numberNode?(numberNode.textContent.match(/\\d+/)||[])[0]:String(index+1);
  var answer=answerGroups[number];
  if(!answer){return;}

  var targetSets=[
   emptyElements(exercise,'.bl'),
   emptyElements(exercise,'.pw .top,.pw .bot div'),
   emptyElements(exercise,'.vsum .ans'),
   emptyElements(exercise,'.clockwrap .ansline')
  ].filter(function(targets){return targets.length;});
  var variants=answerVariants(answer),didFill=false;

  for(var t=0;t<targetSets.length&&!didFill;t++){
   for(var v=0;v<variants.length;v++){
    if(targetSets[t].length===variants[v].length){
     targetSets[t].forEach(function(target,i){addAnswerValue(target,variants[v][i]);});
     didFill=true;
     break;
    }
   }
  }
  if(!didFill){addAnswerCard(exercise,answer);}
 });

 toggle.textContent='Show answers';
 toggle.setAttribute('aria-pressed','false');
 toggle.addEventListener('click',function(){
  showing=!showing;
  document.body.classList.toggle('answers-visible',showing);
  toggle.textContent=showing?'Hide answers':'Show answers';
  toggle.setAttribute('aria-pressed',showing?'true':'false');
 });`;

for (const fileName of worksheetFiles) {
  const filePath = join(worksheetDirectory, fileName);
  let html = readFileSync(filePath, 'utf8');

  if (!html.includes('/* Inline answer reveal */')) {
    html = html.replace('.answers{display:none;', `${answerStyles}\n.answers{display:none;`);
  }

  if (!html.includes('var clockLines=[];')) {
    html = html.replace(
      "  var mathTokens=answer.match(/\\$?\\d+(?::\\d{2})?(?:\\.\\d+)?(?:½)?(?:c)?|½|[<>=]|minus|plus|whole|part|yes|no|odd|even|true|false/gi)||[];\n  [chunks,slashChunks,mathTokens].forEach(function(items){",
      "  var mathTokens=answer.match(/\\$?\\d+(?::\\d{2})?(?:\\.\\d+)?(?:½)?(?:c)?|½|[<>=]|minus|plus|whole|part|yes|no|odd|even|true|false/gi)||[];\n  var clockLines=[];\n  chunks.forEach(function(chunk){\n   var match=chunk.match(/^(\\d{1,2}:\\d{2})\\s+(.+)$/);\n   if(match){clockLines.push(match[1],match[2]);}\n  });\n  [chunks,slashChunks,mathTokens,clockLines].forEach(function(items){",
    );
  }

  html = html.replace('>Show answer key</button>', '>Show answers</button>');
  html = html.replace(
    / var showing=false,toggle=document\.getElementById\('answers-toggle'\);[\s\S]*? toggle\.textContent=showing\?'Hide answer key':'Show answer key';\n \}\);/,
    answerScript,
  );

  writeFileSync(filePath, html);
}

console.log(`Updated ${worksheetFiles.length} worksheet files.`);
