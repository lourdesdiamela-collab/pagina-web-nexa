<?php
$faqs = [
    [
        'q' => '¿Cómo sé si NEXA es para mi marca?',
        'a' => 'Trabajamos con negocios que quieren crecer, posicionarse y vender más pero necesitan dirección estratégica. Si tu marca tiene potencial pero sentís que comunicás sin rumbo, somos tu equipo.'
    ],
    [
        'q' => '¿Cuánto tiempo lleva ver resultados tangibles?',
        'a' => 'Depende de tu punto de partida. Estrategias de visibilidad y campañas pueden traer tráfico rápido, mientras que construir autoridad de marca y transformar el perfil lleva entre 30 y 60 días para ver un impacto sólido.'
    ],
    [
        'q' => '¿Tengo que contratar el ecosistema completo?',
        'a' => 'No. Entendemos qué necesita tu negocio hoy y proponemos soluciones a medida. Podés arrancar solo con Campañas, Gestión de Redes, o una Consultoría Estratégica puntual.'
    ]
];
?>
<section id="faq" class="faq">
    <div class="container">
        <div class="section-header gsap-fade-in-up">
            <span class="section-tag">Preguntas frecuentes</span>
            <h2 class="section-title">Resolvemos tus dudas</h2>
        </div>
        <div class="faq-list gsap-fade-in-up" data-delay="0.2">
            <?php foreach ($faqs as $faq): ?>
                <div class="faq-item">
                    <button class="faq-question">
                        <span><?php echo esc_html($faq['q']); ?></span>
                        <div class="faq-icon"><i data-lucide="plus"></i></div>
                    </button>
                    <div class="faq-answer">
                        <div class="faq-answer-inner"><?php echo esc_html($faq['a']); ?></div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
