/*
 * Términos y Condiciones generales y Política de Privacidad de NEXA.
 * Mismo formato que los contratos (lib/contratos.mjs): secciones con
 * párrafos e ítems, para mostrarlas con <LegalSecciones />.
 *
 * Si cambiás un texto, subí LEGAL_VERSION en lib/legal.mjs.
 */
import { TITULAR, identificacionTitular } from './legal.mjs';
import { CONTRATOS } from './contratos.mjs';

export function terminos() {
  return [
    {
      titulo: '1. Quiénes somos',
      parrafos: [
        `Este sitio (${TITULAR.sitio}) es de ${identificacionTitular()}. Contacto: ${TITULAR.email}.`,
        'Estos Términos regulan el uso del sitio, la contratación de servicios y la compra de recursos digitales de NEXA Aprende. Al usar el sitio o comprar, aceptás estos Términos.',
      ],
    },
    {
      titulo: '2. Servicios de marketing',
      parrafos: [
        'Cada servicio tiene su propio contrato, con el alcance, los plazos, las rondas de cambios, el precio, la renovación y la baja. Se acepta en el checkout junto con estos Términos, y te llega una copia completa por mail:',
      ],
      items: CONTRATOS.map((c) => `${c.nombre}: ${TITULAR.sitio}/contratos/${c.slug}`),
    },
    {
      titulo: '3. Precios y medios de pago',
      items: [
        'Los precios están en pesos argentinos y son los publicados al momento de comprar. El precio que se cobra siempre es el que calcula el servidor según el plan elegido.',
        'Se puede pagar con Mercado Pago (tarjeta, dinero en cuenta y otros medios que ofrece Mercado Pago) o por transferencia bancaria. Con transferencia hay 10% de descuento en los servicios.',
        'Las promociones y cupones tienen la vigencia y las condiciones que se indican en cada caso.',
      ],
    },
    {
      titulo: '4. NEXA Aprende (recursos digitales)',
      items: [
        'Los recursos se entregan en formato digital en "Mis recursos", con la cuenta con la que compraste, apenas se acredita el pago.',
        'Son para uso personal o de tu negocio. No se pueden revender, compartir públicamente ni redistribuir.',
        'Una vez descargado o abierto el recurso, no corresponde el derecho de arrepentimiento (artículo 1116 del Código Civil y Comercial), porque el contenido digital ya fue entregado para su uso permanente. Si tuviste un problema para acceder, escribinos y lo resolvemos.',
      ],
    },
    {
      titulo: '5. Botón de arrepentimiento y botón de baja',
      items: [
        `Arrepentimiento: si contrataste como consumidor, podés revocar la compra o contratación dentro de los 10 días corridos, sin motivo y sin costo, desde ${TITULAR.sitio}/arrepentimiento (artículo 34 de la Ley 24.240 y artículo 1110 del Código Civil y Comercial).`,
        `Baja: podés pedir la baja de un servicio en cualquier momento desde ${TITULAR.sitio}/baja, con las condiciones de aviso de tu contrato (artículo 10 ter de la Ley 24.240).`,
        'En los dos casos no hace falta registrarse ni hacer otros trámites, y te mandamos una constancia con número de trámite dentro de las 24 horas.',
      ],
    },
    {
      titulo: '6. Uso del sitio',
      items: [
        'Los textos, diseños, marcas, logos y materiales del sitio son de NEXA o de sus licenciantes. No se pueden copiar ni usar con fines comerciales sin autorización escrita.',
        'No está permitido usar el sitio o sus formularios para enviar información falsa, spam o contenido ilegal, ni intentar acceder a partes no públicas del sitio.',
        'El asistente de chat del sitio usa inteligencia artificial: puede equivocarse. Lo que vale es lo publicado en la página de Servicios y en los contratos.',
      ],
    },
    {
      titulo: '7. Responsabilidad',
      parrafos: [
        'Hacemos lo posible para que el sitio funcione siempre y la información sea correcta, pero puede haber interrupciones o errores. Los contenidos de blog y de Aprende son informativos y generales: no son asesoramiento profesional para tu caso concreto.',
      ],
    },
    {
      titulo: '8. Privacidad',
      parrafos: [`Tratamos tus datos según la Política de Privacidad: ${TITULAR.sitio}/privacidad.`],
    },
    {
      titulo: '9. Cambios, reclamos y jurisdicción',
      items: [
        'Podemos actualizar estos Términos. La versión vigente está siempre en esta página, con su fecha. Cada compra o contratación se rige por la versión que aceptaste.',
        `Consultas y reclamos: ${TITULAR.email}. Respondemos dentro de los 5 días hábiles. Si sos consumidor, también podés reclamar ante la autoridad de Defensa del Consumidor de tu jurisdicción o en la plataforma nacional de Defensa del Consumidor (argentina.gob.ar).`,
        `Se aplican las leyes de la República Argentina. Son competentes los tribunales ordinarios de la ${TITULAR.ciudad}, salvo que seas consumidor, en cuyo caso podés elegir los tribunales de tu domicilio.`,
      ],
    },
  ];
}

export function privacidad() {
  return [
    {
      titulo: '1. Responsable',
      parrafos: [
        `El responsable de tus datos es ${identificacionTitular()}. Contacto para temas de datos personales: ${TITULAR.email}.`,
        'Tratamos los datos según la Ley 25.326 de Protección de los Datos Personales y sus normas complementarias.',
      ],
    },
    {
      titulo: '2. Qué datos recolectamos',
      items: [
        'Datos de contacto: nombre, email, teléfono y empresa, cuando completás un formulario, escribís al chat o contratás.',
        'Datos de la contratación: plan, montos, referencia del pedido, fecha, IP y versión de los términos que aceptaste. Los datos de tu tarjeta los procesa Mercado Pago: nosotros no los vemos ni los guardamos.',
        'Si sos cliente: los datos de facturación, la información de tu negocio que cargás en el formulario de inicio, los archivos de marca que subís (logo, fotos, referencias) y los accesos que nos das a tus redes o cuentas publicitarias. Nunca pedimos contraseñas.',
        'Si comprás en NEXA Aprende: los datos de tu cuenta y tus compras.',
        'Datos de navegación: páginas visitadas, dispositivo y origen de la visita, mediante cookies y herramientas de medición (Google Tag Manager y el píxel de Meta) cuando están activas.',
      ],
    },
    {
      titulo: '3. Para qué los usamos',
      items: [
        'Responder tus consultas y presupuestos.',
        'Prestar los servicios contratados, cobrarlos y avisarte vencimientos.',
        'Mandarte la información de tu pedido, tu portal de cliente y tus entregas.',
        'Medir y mejorar el sitio y nuestros anuncios.',
        'Cumplir obligaciones legales e impositivas.',
      ],
      parrafos: ['No vendemos tus datos ni los usamos para otra cosa sin tu consentimiento.'],
    },
    {
      titulo: '4. Con quién los compartimos',
      parrafos: [
        'Solo con los proveedores que necesitamos para trabajar, que tratan los datos por cuenta nuestra: alojamiento del sitio y del portal (Vercel), base de datos (Neon), pagos (Mercado Pago), correo electrónico (Google), Meta (cuando publicamos o pautamos para tu negocio) y servicios de inteligencia artificial que usamos para producir contenido y responder el chat (Anthropic). Algunos de estos proveedores guardan datos fuera de Argentina; trabajamos con empresas que ofrecen niveles adecuados de protección.',
        'También podemos compartir datos si lo exige una autoridad competente.',
      ],
    },
    {
      titulo: '5. Cuánto tiempo los guardamos',
      parrafos: [
        'Mientras dure la relación comercial y después durante el plazo que exigen las normas impositivas y contables, o el necesario para atender reclamos.',
      ],
    },
    {
      titulo: '6. Tus derechos',
      items: [
        `Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a ${TITULAR.email}. Respondemos el acceso dentro de los 10 días corridos y la rectificación o supresión dentro de los 5 días hábiles, como indica la Ley 25.326.`,
        'Podés dejar de recibir comunicaciones comerciales cuando quieras, respondiendo el mail o pidiéndolo por el mismo medio.',
        'La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.',
      ],
    },
    {
      titulo: '7. Cookies',
      parrafos: [
        'Usamos cookies propias para que funcionen el inicio de sesión y el carrito, y cookies de medición y publicidad (Google y Meta) para saber cómo se usa el sitio y mostrar anuncios. Podés borrarlas o bloquearlas desde la configuración de tu navegador; el sitio sigue funcionando, salvo el inicio de sesión.',
      ],
    },
    {
      titulo: '8. Seguridad',
      parrafos: [
        'Usamos conexiones cifradas, contraseñas guardadas con cifrado, accesos restringidos y proveedores con estándares de seguridad reconocidos. Ningún sistema es infalible: si detectamos un incidente que afecte tus datos, te vamos a avisar.',
      ],
    },
    {
      titulo: '9. Menores',
      parrafos: ['Los servicios y el sitio están dirigidos a mayores de 18 años.'],
    },
    {
      titulo: '10. Cambios',
      parrafos: ['Si cambiamos esta política, publicamos la nueva versión en esta página con su fecha. Si el cambio es importante, también avisamos por mail a los clientes.'],
    },
  ];
}
