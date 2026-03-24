<section class="about">
    <div class="container">
        <div class="about-grid">
            <div class="gsap-fade-in-up">
                <span class="about-tag">¿Quiénes somos?</span>
                <h2 class="about-title">No somos una agencia más. Somos tu equipo de crecimiento.</h2>
                <p class="about-text">
                    NEXA combina marketing estratégico, automatización de procesos, gestión de redes y CRM para que tu negocio funcione con más orden, más profesionalismo y mejores resultados. No te vendemos likes, te ayudamos a <strong>facturar más y trabajar mejor</strong>.
                </p>
                <div class="about-pills">
                    <?php 
                        $pills = ['Marketing', 'Redes sociales', 'Automatización', 'CRM', 'Orden comercial', 'Crecimiento'];
                        foreach ($pills as $index => $pill):
                    ?>
                        <span class="pill gsap-stagger-scale" data-delay="<?php echo 0.3 + ($index * 0.1); ?>">
                            <?php echo esc_html($pill); ?>
                        </span>
                    <?php endforeach; ?>
                </div>
            </div>
            
            <div class="gsap-fade-in-right" data-delay="0.4">
                <div class="premium-image-wrapper">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/about_mockup.png" alt="NEXA Automation Workflow" />
                </div>
            </div>
        </div>
    </div>
</section>
