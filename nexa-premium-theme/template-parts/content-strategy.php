<!-- template-parts/content-strategy.php -->
<section id="estrategia" class="section-padding strategy-section">
    <div class="container">
        <div class="section-header text-center reveal">
            <h2 class="section-title">El Criterio <span class="text-indigo">NEXA</span></h2>
            <p class="section-subtitle">Nuestra metodología no es genérica. Aplicamos un rigor técnico y estratégico diseñado para negocios que buscan el liderazgo absoluto.</p>
        </div>

        <div class="strategy-grid">
            <?php
            $steps = [
                ['icon' => 'search', 'title' => 'Inmersión & Auditoría', 'desc' => 'Analizamos tus métricas, procesos y posicionamiento actual para identificar fugas de capital y oportunidades ocultas.'],
                ['icon' => 'target', 'title' => 'Diseño Estratégico', 'desc' => 'Construimos el mapa de crecimiento: oferta irresistible, arquitectura de mensajes y selección de canales de alto impacto.'],
                ['icon' => 'trending-up', 'title' => 'Escalado Comercial', 'desc' => 'Inyectamos pauta inteligente y optimizamos los procesos de venta para transformar la demanda en facturación predecible.'],
            ];

            foreach ($steps as $i => $step) : ?>
                <div class="strategy-step text-center reveal" style="transition-delay: <?php echo $i * 0.1; ?>s">
                    <div class="step-icon-container">
                        <i data-lucide="<?php echo $step['icon']; ?>" class="step-icon"></i>
                    </div>
                    <h4 class="step-title"><?php echo $step['title']; ?></h4>
                    <p class="step-desc"><?php echo $step['desc']; ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<style>
.strategy-section {
    background: #050506;
}

.strategy-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 60px;
    margin-top: 60px;
}

.step-icon-container {
    width: 96px;
    height: 96px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2.5rem;
    color: var(--primary);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.step-icon { width: 40px; height: 40px; }

.strategy-step:hover .step-icon-container {
    border-color: var(--primary);
    transform: scale(1.1);
    background: rgba(99, 102, 241, 0.1);
}

.step-title {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
}

.step-desc {
    color: var(--text-muted);
    line-height: 1.8;
}

@media (max-width: 992px) {
    .strategy-grid { grid-template-columns: 1fr; gap: 40px; }
}
</style>
