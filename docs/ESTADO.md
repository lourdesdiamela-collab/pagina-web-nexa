# Estado del proyecto NEXA

Ultima actualizacion: 17 de septiembre de 2026

Este documento existe para que cualquiera (Lu incluida) pueda abrir el proyecto desde cero, en cualquier computadora, y entender en que estado esta sin que nadie se lo explique.

## Que es cada cosa

Hay dos sistemas separados, cada uno con su repositorio y su proyecto de Vercel.

El sitio publico. Repositorio pagina-web-nexa. Rama de produccion: claude/redesign-premium-motion. Proyecto de Vercel: pagina-web-nexa-preview. Sirve nexagrowth.com.ar. Incluye la home, servicios con checkout, el blog, y la tienda Aprende con sus 100 productos descargables.

El CRM, llamado NEXA OS. Repositorio Nexa-CRM. Rama de produccion: main. Proyecto de Vercel: nexa-crm. Sirve crm.nexagrowth.com.ar. Es donde viven los clientes, los pagos, las tareas y el portal de clientes.

Las dos bases de datos son Postgres en Neon, cada una la suya, conectadas desde Vercel.

## Las 10 herramientas de automatizacion

El plan es que la operacion administrativa funcione sola. Estado real al dia de hoy:

1. Alta automatica por pago. HECHA. Cuando Mercado Pago avisa que se acredito un pago, el cliente se crea solo en el CRM con su servicio, plan, monto, fecha y estado onboarding pendiente. No duplica si el aviso llega repetido. Si el CRM no responde, el pago queda pendiente y se reintenta. Se ve en el CRM, en Pagos automaticos.

2. 2. Formulario de inicio. HECHA. Despues del pago se le manda al cliente un link privado y unico para que cargue sus datos de facturacion, sus accesos y el brief de su negocio. Se puede completar en varias veces. Al enviarse, completa la ficha del cliente. Se ve en el CRM, en Formularios de inicio.
  
   3. 3. Panel de accesos con recordatorio a los 3 dias. PENDIENTE. Hoy existe solo un campo suelto, sin checklist ni aviso automatico.
     
      4. 4. Generador de contrato en PDF. PENDIENTE.
        
         5. 5. Registro de entregables y revisiones por plan. A MEDIAS. Se registran entregables, pero no hay tope por plan ni alerta al pasarse.
           
            6. 6. Panel de capacidad por servicio. PENDIENTE.
              
               7. 7. Reportes por cliente con enlace fijo de Looker Studio. PENDIENTE.
                 
                  8. 8. Captura de leads de WhatsApp con campana de origen. PENDIENTE.
                    
                     9. 9. Control de cobranza automatico. A MEDIAS. El dato de pagos existe, el aviso automatico al cliente y a Lu no.
                       
                        10. 10. Solicitudes de arrepentimiento. HECHA. La pagina /arrepentimiento tiene formulario real. Genera un numero de tramite tipo ARR-2026-0001, manda la constancia al solicitante, avisa a Lu y crea el caso en el CRM. Se ve en el CRM, en Arrepentimiento.
                           
                            11. ## Pendiente de Lu
                           
                            12. Nada de esto lo puede hacer Claude: son claves y textos que tiene que cargar ella.
                           
                            13. Cargar SITE_TO_CRM_SECRET en los dos proyectos de Vercel, con el mismo valor exacto en ambos. Sin esto, el sitio y el CRM no se reconocen y las altas automaticas quedan pendientes de sincronizar (no se pierden, se reintentan).
                           
                            14. Cargar GMAIL_USER y GMAIL_APP_PASSWORD en el proyecto del sitio. Ver la seccion de email mas abajo, porque esto es mas grave de lo que parece.
                           
                            15. Rotar la contrasena del administrador del CRM. La anterior estuvo publicada en la pantalla de login y sigue en el historial de git: hay que darla por comprometida.
                           
                            16. Escribir los textos legales de /terminos, /privacidad y /arrepentimiento. Las tres paginas existen y estan maquetadas, pero el cuerpo legal esta vacio esperando su texto.
                           
                            17. ## El email no sale (importante)
                           
                            18. Hoy el sitio no manda ningun mail en produccion. Faltan GMAIL_USER y GMAIL_APP_PASSWORD en Vercel, y el codigo, al no encontrarlas, saltea el envio sin tirar error y sin dejar registro visible.
                           
                            19. Circuitos que quedan mudos por eso:
                           
                            20. - Respuesta automatica a quien escribe por el formulario de contacto, y el aviso a Lu de esa consulta.
                                - - Confirmacion de pedido de servicio al cliente, y aviso a Lu.
                                  - - Confirmacion de pago aprobado al cliente, y aviso a Lu.
                                    - - Constancia de solicitud de arrepentimiento.
                                      - - Mail con el link del formulario de inicio.
                                       
                                        - Todo lo demas de esos circuitos funciona igual: los datos se guardan, los pedidos se procesan, los casos se crean. Es puntualmente el mail el que nunca sale.
                                       
                                        - ## Problemas conocidos sin resolver
                                       
                                        - En la ficha de producto de Aprende, en celular, el boton flotante de WhatsApp tapa unos 8 pixeles de una esquina del boton Agregar al carrito. Los dos son botones fijos y la altura del contenido cambia segun el producto, asi que no hay un valor unico que lo resuelva. Queda para cuando se haga el rediseno. El boton se sigue pudiendo tocar.
                                       
                                        - ## Decisiones tomadas que no hay que deshacer
                                       
                                        - La rama master del repositorio del sitio esta muerta. Es una arquitectura vieja y distinta, un sitio estatico sin tienda ni base de datos. No es lo que esta publicado y no hay que tomarla como referencia.
                                       
                                        - En prisma/schema.prisma el provider va en postgresql, nunca en sqlite. La base real de produccion es Postgres en Neon. Ponerlo en sqlite rompe el deploy.
                                       
                                        - Prisma no soporta comentarios de bloque. Solo comentarios de linea. Un solo comentario de bloque en el schema rompe el deploy entero durante la instalacion de dependencias, antes de que llegue a compilar.
                                       
                                        - El build de produccion del sitio corre prisma db push con la opcion que acepta perdida de datos, en cada deploy. Esto ya estaba asi de antes. Es riesgoso y conviene revisarlo con calma, pero no se toco para no cambiar infraestructura sin decision de Lu.
                                       
                                        - No se toca nada de ARCA ni Data Fiscal. Decision expresa de Lu: no tiene nada armado ni asociado.
                                       
                                        - El contenido inventado se saco a proposito y no hay que reponerlo. NEXA todavia no tiene clientes, asi que los testimonios, los casos de exito, los logos de marcas ajenas presentadas como clientes, los contadores y las resenas de producto eran todos falsos. Cuando haya clientes reales se repone con datos reales y verificables.
                                        - 
