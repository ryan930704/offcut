const $ = id => document.getElementById(id);
const sample = '900, 900, 900, 1400, 1400, 1400';
let model, mode = 'packed';
function pack({stock, kerf, pieces}, sorted) {
  const boards = [];
  const lengths = sorted ? [...pieces].sort((a,b)=>b-a) : pieces;
  for (const length of lengths) {
    const candidates = sorted ? boards : boards.slice(-1);
    let board;
    for (const candidate of candidates) {
      const gap = candidate.left-length;
      if ((gap === 0 || gap >= kerf) && (!board || candidate.left < board.left)) board=candidate;
    }
    if (!board) {board={left:stock, cuts:[]}; boards.push(board);}
    const loss = board.left === length ? 0 : kerf;
    board.cuts.push({length,loss});
    board.left -= length+loss;
  }
  return boards;
}
function draw() {
  const ordered = pack(model,false), optimized = pack(model,true);
  const boards = mode==='packed' ? optimized : ordered;
  const delta = ordered.length-optimized.length;
  $('summary').textContent = boards.length+' board'+(boards.length===1?'':'s')+' · '+model.pieces.length+' pieces · '+(delta===0?'Same board count':Math.abs(delta)+' fewer with '+(delta>0?'best fit':'list order'));
  $('boards').replaceChildren();
  boards.forEach((board,index)=>{
    const el=document.createElement('article');
    el.className='board';
    const segments=board.cuts.map(({length,loss})=>'<span class="piece" style="width:'+length/model.stock*100+'%;margin-right:'+loss/model.stock*100+'%">'+length/10+'</span>').join('');
    el.innerHTML='<header><b>BOARD '+String(index+1).padStart(2,'0')+'</b><b>'+board.left/10+' mm left</b></header><div class="rail" aria-hidden="true">'+segments+'</div><footer>Cut sequence (mm): '+board.cuts.map(c=>c.length/10).join(' → ')+'</footer>';
    $('boards').append(el);
  });
  for(const id of ['packed','listed']) $(id).setAttribute('aria-pressed',String(id===mode));
}
function plan() {
  const parse=v=>/^\d+(?:\.\d)?$/.test(v.trim()) ? Math.round(Number(v)*10) : NaN;
  const stock=parse($('stock').value),kerf=parse($('kerf').value);
  const pieces=$('parts').value.trim().split(/[,\n]/).map(parse);
  if(!Number.isSafeInteger(stock)||stock<=0||!Number.isSafeInteger(kerf)||kerf>stock||pieces.length>200||pieces.some(n=>!Number.isSafeInteger(n)||n<=0||n>stock||(n!==stock&&n+kerf>stock))){
    $('error').textContent='Check stock, kerf and lengths. Use millimetres with up to one decimal. Each piece and its separation cut must fit on one board.';
    $('summary').textContent='No plan for these inputs.'; $('boards').replaceChildren(); model=null;return;
  }
  $('error').textContent='';model={stock,kerf,pieces};draw();
}
$('plan').onclick=plan;
for (const id of ['stock','kerf','parts']) $(id).oninput=()=>{
  model=null;
  $('boards').replaceChildren();
  $('error').textContent='';
  $('summary').textContent='Inputs changed. Select Plan cuts to update the diagram.';
};
$('demo').onclick=()=>{$('stock').value=2400;$('kerf').value=3;$('parts').value=sample;mode='packed';plan();};
for(const id of ['packed','listed']) $(id).onclick=()=>{if(model){mode=id;draw();}};
plan();
