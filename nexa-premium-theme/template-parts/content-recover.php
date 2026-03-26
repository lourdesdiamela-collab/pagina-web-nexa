<?php
$features = [
    ['icon' => 'refresh-cw', 'text' => 'Reactivación de Leads fríos'],
    ['icon' => 'users', 'text' => 'Fidelización post-venta automatizada'],
    ['icon' => 'target', 'text' => 'Encuestas de satisfacción (NPS)'],
    ['icon' => 'zap', 'text' => 'Upselling inteligente a base actual']
];
?>
<section class="recover-section">
    <div class="container">
        <div class="recover-grid">
            <div class="recover-content gsap-fade-in-left">
                <span class="recover-badge">Lanzamiento Exclusivo</span>
                <h2 class="recover-title">Tu base de datos es una <span class="text-gradient">mina de oro.</span></h2>
                <p class="recover-desc">
                    El 80% de los negocios se obsesiona con conseguir clientes nuevos y olvida a los que ya compraron o preguntaron. Diseñamos un sistema automatizado de Customer Experience para reconectar, fidelizar y recuperar ventas perdidas sin que tengas que mover un dedo.
                </p>
                <div class="recover-features">
                    <?php foreach ($features as $index => $f): ?>
                        <div class="recover-feature gsap-stagger-up" data-delay="<?php echo 0.2 + ($index * 0.1); ?>">
                            <div class="recover-icon"><i data-lucide="<?php echo esc_attr($f['icon']); ?>"></i></div>
                            <span><?php echo esc_html($f['text']); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
                <a href="#contacto" class="btn btn-primary" style="align-self: flex-start;">Implementar NEXA Recover</a>
            </div>

            <div class="recover-visual gsap-fade-in-up" data-delay="0.2">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/recover_premium.png" alt="Nexa Recover Customer Experience" />
            </div>
        </div>
    </div>
</section>
