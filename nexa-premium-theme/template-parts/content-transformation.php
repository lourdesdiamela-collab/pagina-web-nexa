<?php
$items = [
    ['title' => 'Dejás de improvisar', 'desc' => 'Cada acción tiene un porqué estratégico alineado a ventas.'],
    ['title' => 'Ordenás tus procesos', 'desc' => 'Todo conectado: leads, seguimiento y facturación.'],
    ['title' => 'Mejorás tu imagen', 'desc' => 'Tu marca transmite lo que realmente valés a tus clientes.'],
    ['title' => 'Seguís tus oportunidades', 'desc' => 'Ningún cliente potencial se pierde en el camino.'],
    ['title' => 'Reducís tareas manuales', 'desc' => 'Lo que se puede automatizar, se automatiza para siempre.'],
    ['title' => 'Convertís mejor', 'desc' => 'Multiplicás tus ventas optimando tus embudos vitales.']
];
?>
<section class="transformation">
    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/dark_deco.png" alt="Deco" class="dark-deco-image float-anim" />
    <div class="container">
        <div class="section-header gsap-fade-in-up">
            <span class="section-tag">El cambio real</span>
            <h2 class="section-title">Qué cambia cuando trabajás con NEXA</h2>
            <p class="section-subtitle">Una marca más clara, un negocio más ordenado y un marketing que sí empuja resultados.</p>
        </div>
        <div class="transform-grid">
            <?php foreach ($items as $index => $item): ?>
                <div class="transform-card gsap-stagger-scale" data-delay="<?php echo $index * 0.1; ?>">
                    <div class="lima-dot"></div>
                    <h4><?php echo esc_html($item['title']); ?></h4>
                    <p><?php echo esc_html($item['desc']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
