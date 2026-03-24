<?php
$services = [
    ['icon' => 'bar-chart-3', 'title' => 'Marketing & Estratégia', 'desc' => 'Estrategia de contenido, gestión de redes y posicionamiento de marca con una visión comercial clara.'],
    ['icon' => 'zap', 'title' => 'Automatización de Procesos', 'desc' => 'Flujos automáticos que eliminan tareas repetitivas y mantienen tu negocio funcionando 24/7.'],
    ['icon' => 'users', 'title' => 'CRM y Seguimiento de Leads', 'desc' => 'Organizá tu base de contactos, hacé seguimiento inteligente y convertí más oportunidades.'],
    ['icon' => 'target', 'title' => 'Campañas y Captación', 'desc' => 'Publicidad en Meta y Google Ads diseñada para traer leads calificados con ROI real.'],
    ['icon' => 'layers', 'title' => 'Order y Estructura Digital', 'desc' => 'Profesionalizamos tu operación: procesos, herramientas y estructura para escalar sin caos.'],
    ['icon' => 'refresh-cw', 'title' => 'NEXA Recover', 'desc' => 'Sistema de recuperación de clientes inactivos y oportunidades perdidas. Reactivá lo que ya tenés.']
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
