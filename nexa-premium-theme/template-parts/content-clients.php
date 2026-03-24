<section class="clients">
    <div class="container">
        <p class="clients-label">Marcas que confiaron en NEXA</p>
        <div class="clients-row">
            <?php 
                $clients = ['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'];
                foreach ($clients as $index => $name): 
            ?>
                <span class="client-logo gsap-stagger-up" data-delay="<?php echo $index * 0.1; ?>">
                    <?php echo esc_html($name); ?>
                </span>
            <?php endforeach; ?>
        </div>
    </div>
</section>
