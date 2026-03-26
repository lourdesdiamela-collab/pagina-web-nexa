<section class="about">
    <div class="container">
        <div class="about-grid">
            <div class="gsap-fade-in-up">
                <span class="about-tag">¿Quiénes somos?</span>
                <h2 class="about-title">Tu equipo estratégico de marketing y crecimiento.</h2>
                <p class="about-text">
                    En NEXA combinamos estrategia, contenido, campañas y seguimiento para ayudar a marcas y negocios a crecer con más claridad, mejor imagen y mejores resultados. No trabajamos para sumar publicaciones vacías: trabajamos para que tu marca tenga dirección y tu negocio funcione mejor.
                </p>
                <div class="about-pills">
                    <?php 
                        $pills = ['Estrategia', 'Campañas', 'Contenido', 'Redes Sociales', 'CRM', 'Crecimiento'];
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
