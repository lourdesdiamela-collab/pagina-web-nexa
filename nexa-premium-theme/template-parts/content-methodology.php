<?php
$steps = [
    ['num' => '01', 'title' => 'Diagnóstico', 'desc' => 'Auditoría profunda: qué funciona, qué falla, y oportunidades.'],
    ['num' => '02', 'title' => 'Diseño estratégico', 'desc' => 'Blueprint de acción con sistemas, herramientas y objetivos.'],
    ['num' => '03', 'title' => 'Implementación', 'desc' => 'Set up de CRM, automatizaciones y campañas alineadas.'],
    ['num' => '04', 'title' => 'Optimización', 'desc' => 'Monitoreo, ajustes y escalabilidad del sistema en vivo.']
];
?>
<section id="metodologia" class="methodology">
    <div class="container">
        <div class="section-header gsap-fade-in-up">
            <span class="section-tag">Nuestro proceso</span>
            <h2 class="section-title">El método NEXA</h2>
            <p class="section-subtitle">Un proceso claro para pensar, ejecutar y hacer crecer tu marca.</p>
        </div>
        <div class="method-grid">
            <?php foreach ($steps as $index => $step): ?>
                <div class="method-step gsap-stagger-up" data-delay="<?php echo $index * 0.15; ?>">
                    <div class="method-number"><?php echo esc_html($step['num']); ?></div>
                    <h4><?php echo esc_html($step['title']); ?></h4>
                    <p><?php echo esc_html($step['desc']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
