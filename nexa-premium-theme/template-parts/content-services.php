<?php
$services = [
    ['icon' => 'bar-chart-3', 'title' => 'Marketing & Estrategia', 'desc' => 'Planes accionables para posicionar tu marca, conectar con tu audiencia y dominar tu nicho.'],
    ['icon' => 'instagram', 'title' => 'Redes Sociales', 'desc' => 'Gestión profesional, diseño premium y contenido estratégico que construye comunidad y autoridad.'],
    ['icon' => 'target', 'title' => 'Campañas y Captación', 'desc' => 'Publicidad en Meta y Google Ads diseñada para maximizar visibilidad y traer leads calificados.'],
    ['icon' => 'users', 'title' => 'CRM y Seguimiento', 'desc' => 'Sistemas inteligentes (con automatización) para organizar oportunidades y no perder ventas.'],
    ['icon' => 'layers', 'title' => 'Orden Digital', 'desc' => 'Auditoría y estructura para que tu presencia online se vea impecable en cada punto de contacto.'],
    ['icon' => 'refresh-cw', 'title' => 'NEXA Recover', 'desc' => 'Estrategias de fidelización y recuperación reactivando clientes inactivos de tu base de datos.']
];
?>
<section id="servicios" class="services">
    <div class="container">
        <div class="section-header">
            <span class="section-tag">Lo que hacemos</span>
            <h2 class="section-title">Soluciones diseñadas para crecer</h2>
            <p class="section-subtitle">Cada servicio está pensado para que tu negocio funcione mejor, se vea mejor y facture más.</p>
        </div>
        <div class="services-grid">
            <?php foreach ($services as $index => $s): ?>
                <div class="service-card gsap-stagger-up" data-delay="<?php echo $index * 0.1; ?>">
                    <div class="service-icon"><i data-lucide="<?php echo esc_attr($s['icon']); ?>"></i></div>
                    <h3><?php echo esc_html($s['title']); ?></h3>
                    <p><?php echo esc_html($s['desc']); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
