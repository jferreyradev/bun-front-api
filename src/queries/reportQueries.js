// Archivo de consultas para reportes
export const reportQueries = {
  ejecuciones: {
    label: 'Ejecuciones por periodo y tipo',
    sql: `SELECT PC.DESCRIPCION, PD.DESCRIPCION as DESC_PROC_DET,
         ed.ESTADO, ed.NROEJEC, ec.fechahora as FECHAEJEC,
         ec.GRUPOREP
from WORKFLOW.EJEC_DET ed
inner join WORKFLOW.EJEC_CAB ec on EC.ID_EJEC_CAB = ED.ID_EJEC_CAB
inner join WORKFLOW.PROC_CAB pc on PC.ID_PROC_CAB = EC.ID_PROC_CAB
inner join WORKFLOW.PROC_DET pd on PD.ID_PROC_DET = ED.ID_PROC_DET
inner join WORKFLOW.PROC_CAB_ORDEN o on O.ID_PROC_CAB = PC.ID_PROC_CAB
where 1=1
  {{PERIODO}}{{TIPO}}{{GRUPO}}
order by o.orden, ec.fechahora, ED.ORDENEJEC`,
    colPeriodo: 'ec.PERIODO',
    colTipo: 'ec.IDTIPOLIQ',
    colGrupo: 'ec.GRUPOREP',
    filtros: ['periodo', 'tipo', 'grupo'],
  },
  usuarios: {
    label: 'Usuarios activos por grupo',
    sql: `SELECT u.ID_USUARIO, u.NOMBRE, u.APELLIDO, u.EMAIL, u.GRUPOREP, u.ESTADO
from USUARIOS u
where u.ESTADO = 'ACTIVO'
  {{GRUPO}}
order by u.GRUPOREP, u.APELLIDO, u.NOMBRE`,
    colGrupo: 'u.GRUPOREP',
    filtros: ['grupo']
  },
}
