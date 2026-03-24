<?php
/**
 * Main template file (Landing Page)
 */

get_header(); ?>

<main id="primary" class="site-main">

    <?php 
    // Load sections in the exact order of the Top-Tier React App
    get_template_part('template-parts/content', 'hero');
    get_template_part('template-parts/content', 'clients');
    get_template_part('template-parts/content', 'about');
    get_template_part('template-parts/content', 'services');
    get_template_part('template-parts/content', 'transformation');
    get_template_part('template-parts/content', 'methodology');
    get_template_part('template-parts/content', 'faq');
    get_template_part('template-parts/content', 'contact');
    ?>

</main>

<?php get_footer(); ?>
