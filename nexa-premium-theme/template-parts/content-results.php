<!-- template-parts/content-results.php -->
<section id="resultados" class="section-padding results-section">
    <div class="container">
        <div class="results-header text-center reveal">
            <h2 class="section-title">Impacto Real</h2>
            <p class="results-quote italic">"NEXA transformó nuestra forma de vender. Pasamos de la incertidumbre al control total."</p>
        </div>

        <div class="metrics-grid">
            <?php
            $metrics = [
                ['value' => '+150%', 'label' => 'ROI Promedio', 'desc' => 'En campañas de pauta inteligente.'],
                ['value' => '40h', 'label' => 'Ahorro Mensual', 'desc' => 'Tiempo recuperado por automatización.'],
                ['value' => '3x', 'label' => 'Más Leads', 'desc' => 'Crecimiento de base de datos calificada.'],
            ];

            foreach ($metrics as $i => $item) : ?>
                <div class="glass-card metric-card reveal" style="transition-delay: <?php echo $i * 0.1; ?>s">
                    <span class="metric-value"><?php echo $item['value']; ?></span>
                    <h4 class="metric-label"><?php echo $item['label']; ?></h4>
                    <p class="metric-desc"><?php echo $item['desc']; ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<style>
.results-section {
    background: rgba(0, 0, 0, 0.4);
}

.results-quote {
    font-size: 1.5rem;
    color: var(--text-muted);
    margin-top: -1rem;
    margin-bottom: 4rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
}

.metric-card {
    padding: 3.5rem 2rem;
    text-align: center;
}

.metric-value {
    display: block;
    font-size: 4rem;
    font-weight: 900;
    color: var(--primary);
    margin-bottom: 0.5rem;
    letter-spacing: -0.05em;
}

.metric-label {
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 1rem;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.metric-desc {
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
}

@media (max-width: 768px) {
    .metrics-grid { grid-template-columns: 1fr; }
}
</style>
