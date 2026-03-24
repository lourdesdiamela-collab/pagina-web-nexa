<?php
$faqs = [
    [
        'q' => '¿Cómo sé si NEXA es para mi negocio?',
        'a' => 'Trabajamos con negocios que ya facturan pero necesitan orden, profesionalismo y estrategia. Si tu marca puede más pero estás trabado operativamente, somos tu partner.'
    ],
    [
        'q' => '¿Cuánto tiempo lleva ver resultados tangibles?',
        'a' => 'Automatización y orden operativo impactan casi instantáneamente (1-2 semanas). En captación de leads y ventas recurrentes proyectamos KPIs a los 30-45 días.'
    ],
    [
        'q' => '¿Tengo que contratar la gestión completa?',
        'a' => 'No. Nuestra metodología es modular. Comenzamos con una auditoría y proponemos el stack prioritario. Podés empezar con CRM o Automatización exclusivamente.'
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
