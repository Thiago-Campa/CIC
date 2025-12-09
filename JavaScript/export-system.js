// ============================================
// SISTEMA DE EXPORTACIÓN - CIC Pavón Arriba
// ============================================
// Incluir estas librerías en el HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>

// ============================================
// EXPORTAR PANEL ADMIN (FORMULARIOS)
// ============================================
function exportarFormularios(formato) {
  console.log(`📥 Exportando formularios en formato ${formato}...`);
  
  // Cargar datos
  const persons = JSON.parse(localStorage.getItem('cic_persons') || '[]');
  const households = JSON.parse(localStorage.getItem('cic_households') || '{}');
  
  if (persons.length === 0) {
    alert('❌ No hay datos para exportar');
    return;
  }
  
  // Preparar datos para exportación
  const datosExport = persons.map(person => {
    const household = households[person.householdId] || {};
    const direccion = household.direccion || {};
    
    return {
      'Nombre': person.nombre,
      'Apellido': person.apellido,
      'DNI': person.dni,
      'CUIT': person.cuit || 'N/A',
      'Edad': person.edad || 'N/A',
      'Sexo': person.sexo,
      'Fecha Nacimiento': person.fechaNacimiento || 'N/A',
      'Estado Civil': person.estadoCivil || 'N/A',
      'Ocupación': person.ocupacion || 'N/A',
      'Email': person.correo || 'N/A',
      'Teléfono': person.tel || 'N/A',
      'Relación Hogar': person.relacionHogar || 'N/A',
      'Grupo Familiar': household.grupoFamiliar || 'N/A',
      'Vivienda': household.vivienda || 'N/A',
      'Calle': direccion.calle || 'N/A',
      'Número': direccion.numero || 'N/A',
      'Barrio': direccion.barrio || 'N/A',
      'Ciudad': direccion.ciudad || 'N/A',
      'Provincia': direccion.provincia || 'N/A',
      'Nivel Educativo': person.educacion?.nivelActual || 'N/A',
      'Institución': person.educacion?.institucion || 'N/A',
      'Estado Educación': person.educacion?.estado || 'N/A',
      'Tiene Discapacidad': person.discapacidad?.tiene ? 'Sí' : 'No',
      'Tipo Discapacidad': person.discapacidad?.tipo || 'N/A',
      'Con CUD': person.discapacidad?.conCUD ? 'Sí' : 'No',
      'Vto. CUD': person.discapacidad?.cudVencimiento || 'N/A',
      'Tiene Beneficio': person.beneficioSocial?.tiene ? 'Sí' : 'No',
      'Nombre Beneficio': person.beneficioSocial?.nombre || 'N/A',
      'Organismo': person.beneficioSocial?.organismo || 'N/A',
      'Estado Beneficio': person.beneficioSocial?.estado || 'N/A',
      'Tiene Obra Social': person.obraSocial?.tiene ? 'Sí' : 'No',
      'Nombre OS': person.obraSocial?.nombre || 'N/A',
      'Fecha Registro': new Date(person.creadoEn).toLocaleDateString('es-AR')
    };
  });
  
  if (formato === 'excel') {
    exportarAExcel(datosExport, 'Formularios_CIC');
  } else if (formato === 'pdf') {
    exportarAPDF(datosExport, 'Formularios CIC Pavón Arriba', 'Formularios_CIC');
  }
}

// ============================================
// EXPORTAR CONSULTAS
// ============================================
function exportarConsultas(formato) {
  console.log(`📥 Exportando consultas en formato ${formato}...`);
  
  // Cargar datos
  const consultas = JSON.parse(localStorage.getItem('mockConsultas') || '[]');
  
  if (consultas.length === 0) {
    alert('❌ No hay consultas para exportar');
    return;
  }
  
  // Preparar datos para exportación
  const datosExport = consultas.map(consulta => {
    const fechaCreacion = consulta.fechaCreacion?._date 
      ? new Date(consulta.fechaCreacion._date).toLocaleDateString('es-AR')
      : 'N/A';
    
    const fechaResolucion = consulta.fechaResolucion?._date
      ? new Date(consulta.fechaResolucion._date).toLocaleDateString('es-AR')
      : 'Pendiente';
    
    return {
      'ID': consulta.id,
      'Fecha Creación': fechaCreacion,
      'Paciente': consulta.personaNombre,
      'DNI': consulta.personDni || 'N/A',
      'Tipo': consulta.tipo === 'derivacion' ? 'Derivación' : 'Espontánea',
      'Derivado Por': consulta.derivadoPor || 'N/A',
      'Motivo': consulta.motivo,
      'Descripción': consulta.descripcion,
      'Estado': consulta.estado.toUpperCase(),
      'Prioridad': consulta.prioridad.toUpperCase(),
      'Profesional Asignado': consulta.profesionalNombre || 'Sin asignar',
      'Acciones Tomadas': consulta.accionesTomadas || 'Ninguna',
      'Fecha Resolución': fechaResolucion,
      'Observaciones': consulta.observaciones.length
    };
  });
  
  if (formato === 'excel') {
    exportarAExcel(datosExport, 'Consultas_CIC');
  } else if (formato === 'pdf') {
    exportarAPDF(datosExport, 'Consultas CIC Pavón Arriba', 'Consultas_CIC');
  }
}

// ============================================
// EXPORTAR PROFESIONALES
// ============================================
function exportarProfesionales(formato) {
  console.log(`📥 Exportando profesionales en formato ${formato}...`);
  
  // Cargar datos
  const profesionales = JSON.parse(localStorage.getItem('mockProfesionales') || '[]');
  
  if (profesionales.length === 0) {
    alert('❌ No hay profesionales para exportar');
    return;
  }
  
  // Preparar datos para exportación
  const datosExport = profesionales.map(prof => {
    const fechaCreacion = prof.creadoEn?._date
      ? new Date(prof.creadoEn._date).toLocaleDateString('es-AR')
      : 'N/A';
    
    return {
      'ID': prof.id,
      'Nombre': prof.nombre,
      'Apellido': prof.apellido,
      'Especialidad': prof.especialidad,
      'Matrícula': prof.matricula || 'N/A',
      'Email': prof.email,
      'Teléfono': prof.telefono || 'N/A',
      'Horarios': prof.horarios || 'N/A',
      'Casos Activos': prof.casosActivos || 0,
      'Casos Resueltos': prof.casosResueltos || 0,
      'Estado': prof.activo ? 'Activo' : 'Inactivo',
      'Fecha Registro': fechaCreacion
    };
  });
  
  if (formato === 'excel') {
    exportarAExcel(datosExport, 'Profesionales_CIC');
  } else if (formato === 'pdf') {
    exportarAPDF(datosExport, 'Profesionales CIC Pavón Arriba', 'Profesionales_CIC');
  }
}

// ============================================
// FUNCIÓN GENÉRICA: EXPORTAR A EXCEL
// ============================================
function exportarAExcel(datos, nombreArchivo) {
  try {
    // Verificar que SheetJS esté cargado
    if (typeof XLSX === 'undefined') {
      alert('❌ Error: Librería XLSX no cargada.\n\nAgregue esta línea al HTML:\n<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>');
      return;
    }
    
    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    
    // Ajustar ancho de columnas
    const colWidths = Object.keys(datos[0]).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;
    
    // Generar archivo
    const fecha = new Date().toISOString().split('T')[0];
    const filename = `${nombreArchivo}_${fecha}.xlsx`;
    XLSX.writeFile(wb, filename);
    
    console.log(`✅ Excel exportado: ${filename}`);
    alert(`✅ Archivo exportado exitosamente:\n${filename}`);
    
  } catch (error) {
    console.error('❌ Error exportando a Excel:', error);
    alert(`❌ Error al exportar: ${error.message}`);
  }
}

// ============================================
// FUNCIÓN GENÉRICA: EXPORTAR A PDF
// ============================================
function exportarAPDF(datos, titulo, nombreArchivo) {
  try {
    // Verificar que jsPDF esté cargado
    if (typeof jspdf === 'undefined') {
      alert('❌ Error: Librería jsPDF no cargada.\n\nAgregue estas líneas al HTML:\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>');
      return;
    }
    
    const { jsPDF } = jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape, milímetros, A4
    
    // Título
    doc.setFontSize(18);
    doc.text(titulo, 14, 15);
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')} - ${new Date().toLocaleTimeString('es-AR')}`, 14, 22);
    
    // Total de registros
    doc.text(`Total de registros: ${datos.length}`, 14, 28);
    
    // Preparar datos para tabla
    const columnas = Object.keys(datos[0]);
    const filas = datos.map(obj => Object.values(obj));
    
    // Generar tabla
    doc.autoTable({
      head: [columnas],
      body: filas,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 35, left: 10, right: 10 }
    });
    
    // Footer con número de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Guardar
    const fecha = new Date().toISOString().split('T')[0];
    const filename = `${nombreArchivo}_${fecha}.pdf`;
    doc.save(filename);
    
    console.log(`✅ PDF exportado: ${filename}`);
    alert(`✅ Archivo exportado exitosamente:\n${filename}`);
    
  } catch (error) {
    console.error('❌ Error exportando a PDF:', error);
    alert(`❌ Error al exportar: ${error.message}`);
  }
}

// ============================================
// MODAL SELECTOR DE EXPORTACIÓN
// ============================================
function mostrarModalExportacion(seccion) {
  // Crear modal
  const modal = document.createElement('div');
  modal.id = 'exportModal';
  modal.style.cssText = `
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    z-index: 10000;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <h2 style="color: #2c3e50; margin-bottom: 10px; text-align: center;">📊 Exportar Datos</h2>
      <p style="text-align: center; color: #666; margin-bottom: 25px;">Seleccione el formato de exportación</p>
      
      <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3498db;">
        <strong>Sección:</strong> ${getNombreSeccion(seccion)}<br>
        <strong>Registros:</strong> ${contarRegistros(seccion)}
      </div>
      
      <div style="display: grid; gap: 15px; margin-bottom: 25px;">
        <button onclick="exportarSeccion('${seccion}', 'excel')" style="background: #27ae60; color: white; padding: 15px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s;">
          📗 Exportar a Excel (.xlsx)
        </button>
        <button onclick="exportarSeccion('${seccion}', 'pdf')" style="background: #e74c3c; color: white; padding: 15px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s;">
          📕 Exportar a PDF
        </button>
      </div>
      
      <button onclick="cerrarModalExportacion()" style="background: #95a5a6; color: white; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; width: 100%;">
        Cancelar
      </button>
      
      <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #7f8c8d;">
        💡 Los archivos se descargarán automáticamente
      </p>
    </div>
  `;
  
  // Agregar hover effects
  const buttons = modal.querySelectorAll('button');
  buttons.forEach(btn => {
    if (btn.style.background !== '#95a5a6') {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.05)';
        btn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
      });
    }
  });
  
  document.body.appendChild(modal);
}

function getNombreSeccion(seccion) {
  const nombres = {
    'formularios': 'Formularios / Registro de Personas',
    'consultas': 'Consultas / Casos',
    'profesionales': 'Profesionales'
  };
  return nombres[seccion] || seccion;
}

function contarRegistros(seccion) {
  switch(seccion) {
    case 'formularios':
      return JSON.parse(localStorage.getItem('cic_persons') || '[]').length;
    case 'consultas':
      return JSON.parse(localStorage.getItem('mockConsultas') || '[]').length;
    case 'profesionales':
      return JSON.parse(localStorage.getItem('mockProfesionales') || '[]').length;
    default:
      return 0;
  }
}

function exportarSeccion(seccion, formato) {
  cerrarModalExportacion();
  
  switch(seccion) {
    case 'formularios':
      exportarFormularios(formato);
      break;
    case 'consultas':
      exportarConsultas(formato);
      break;
    case 'profesionales':
      exportarProfesionales(formato);
      break;
    default:
      alert('❌ Sección no reconocida');
  }
}

function cerrarModalExportacion() {
  const modal = document.getElementById('exportModal');
  if (modal) modal.remove();
}

// ============================================
// FUNCIONES GLOBALES
// ============================================
window.mostrarModalExportacion = mostrarModalExportacion;
window.exportarSeccion = exportarSeccion;
window.cerrarModalExportacion = cerrarModalExportacion;
window.exportarFormularios = exportarFormularios;
window.exportarConsultas = exportarConsultas;
window.exportarProfesionales = exportarProfesionales;

console.log('✅ Sistema de exportación cargado');