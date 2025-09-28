import { db } from "/JavaScript/firebase.js";

(function(){
  let charts = {};
  const $ = s => document.querySelector(s);

  function destroy(id){
    if(charts[id]){ charts[id].destroy(); charts[id]=null; }
  }

  function pie(id, labels, data){
    destroy(id);
    charts[id] = new Chart(document.getElementById(id), {
      type:'pie',
      data:{ labels, datasets:[{ data }] },
      options:{ plugins:{ legend:{ position:'bottom' } } }
    });
  }

  function bar(id, labels, data){
    destroy(id);
    charts[id] = new Chart(document.getElementById(id), {
      type:'bar',
      data:{ labels, datasets:[{ data }] },
      options:{ scales:{ y:{ beginAtZero:true, ticks:{ precision:0 } } }, plugins:{ legend:{ display:false } } }
    });
  }

  async function fetchData(){
    const [hhSnap, pSnap] = await Promise.all([
      db.collection("households").get(),
      db.collection("persons").get()
    ]);

    const households = hhSnap.docs.map(d=>({id:d.id, ...d.data()}));
    const persons = pSnap.docs.map(d=>({id:d.id, ...d.data()}));

    return { households, persons };
  }

  function compute({households, persons}){
    // KPIs
    const kpis = {
      persons: persons.length,
      households: households.length,
      cud: persons.filter(p=>p.conCUD===true || String(p.conCUD).toLowerCase()==="si").length,
      os: persons.filter(p=>p.tieneOS===true || String(p.tieneOS).toLowerCase()==="si").length,
    };

    // Sexo
    const sexoCount = {};
    for(const p of persons){
      const s = p.sexo || "No informa";
      sexoCount[s] = (sexoCount[s]||0)+1;
    }

    // Nivel actual
    const niveles = ["Ninguno","Primario","Secundario","Terciario","Universitario","Posgrado","No informa"];
    const nivelCount = Object.fromEntries(niveles.map(n=>[n,0]));
    for(const p of persons){
      const n = p.nivelActual || "No informa";
      nivelCount[n] = (nivelCount[n]||0)+1;
    }

    // Vivienda (desde households.vivienda)
    const vivCount = {};
    for(const h of households){
      const v = h.vivienda || "—";
      vivCount[v] = (vivCount[v]||0)+1;
    }

    // Beneficios (tieneBen)
    let conBen = 0, sinBen = 0;
    for(const p of persons){
      const b = p.tieneBen;
      const label = (typeof b === "boolean") ? (b? "Sí":"No") : (String(b||"").toLowerCase());
      if(["si","sí","true","1","sí"].includes(label)) conBen++;
      else if(["no","false","0"].includes(label)) sinBen++;
      else sinBen++; // si no informa, lo contamos como "No" (podés cambiar)
    }

    return { kpis, sexoCount, nivelCount, vivCount, conBen, sinBen };
  }

  function render(agg){
    // KPIs
    $("#kpi_persons").textContent = agg.kpis.persons;
    $("#kpi_households").textContent = agg.kpis.households;
    $("#kpi_cud").textContent = agg.kpis.cud;
    $("#kpi_os").textContent = agg.kpis.os;

    // Gráficos
    const sexoLabels = Object.keys(agg.sexoCount);
    const sexoData = sexoLabels.map(k=>agg.sexoCount[k]);
    pie("chSexo", sexoLabels, sexoData);

    const nivelLabels = Object.keys(agg.nivelCount);
    const nivelData = nivelLabels.map(k=>agg.nivelCount[k]);
    bar("chNivel", nivelLabels, nivelData);

    const vivLabels = Object.keys(agg.vivCount);
    const vivData = vivLabels.map(k=>agg.vivCount[k]);
    pie("chVivienda", vivLabels, vivData);

    pie("chBeneficio", ["Con beneficio","Sin beneficio"], [agg.conBen, agg.sinBen]);
  }

  async function reload(){
    const raw = await fetchData();
    const agg = compute(raw);
    render(agg);
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    const btn = $("#btnReload");
    if(btn) btn.addEventListener("click", reload);
    // primera carga
    reload();
  });
})();