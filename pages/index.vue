<template>
  <div class="homepage">


    <!-- Hero Section - Approche contemplative -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Patrick Laumond</h1>
          <div class="hero-subtitle">
            <span class="subtitle-line">Artiste contemporain</span>
            <span class="subtitle-line">Créateur du Métahisme</span>
          </div>
          <div class="hero-description">
            <p>Un univers où l'art devient métaphore,</p>
            <p>où chaque forme révèle une pensée,</p>
            <p>où l'angle droit rencontre l'émotion.</p>
          </div>
        </div>
        <div class="hero-visual">
          <div class="geometric-shape shape-1"></div>
          <div class="geometric-shape shape-2"></div>
          <div class="geometric-shape shape-3"></div>
        </div>
      </div>
    </section>

    <!-- Oeuvres Section - Présentation artistique -->
    <section id="oeuvres" class="section oeuvres-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Oeuvres</h2>
          <div class="section-divider"></div>
        </div>
        <div class="artworks-showcase">
          <div v-for="(artwork, index) in featuredArtworks" :key="artwork.id" 
               class="artwork-item" :class="`artwork-${index + 1}`">
            <div class="artwork-frame">
              <img :src="artwork.imageUrl" :alt="artwork.title" />
            </div>
            <div class="artwork-info">
              <h3 class="artwork-title">{{ artwork.title }}</h3>
              <div class="artwork-category">{{ artwork.category }}</div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/artworks" class="artistic-link">Explorer la collection</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Analyses Section - Texte et réflexion -->
    <section id="analyses" class="section analyses-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Analyses</h2>
          <div class="section-divider"></div>
        </div>
        <div class="analyses-content">
          <div class="analysis-text">
            <div class="analysis-quote">
              <p>"L'art de Patrick Laumond transcende les frontières conventionnelles, 
              créant un dialogue entre la géométrie pure et l'expression émotionnelle."</p>
              <span class="quote-author">— Cécile Jouanneau, Critique d'art</span>
            </div>
            <div class="analysis-excerpt">
              <p>Les analyses révèlent la profondeur conceptuelle du Métahisme, 
              où chaque œuvre devient un chapitre d'une réflexion philosophique 
              sur notre époque et ses contradictions.</p>
            </div>
          </div>
          <div class="analysis-visual">
            <div class="text-block">
              <h3>Le Portant</h3>
              <p>Une exploration des tensions entre ordre et chaos...</p>
            </div>
            <div class="text-block">
              <h3>Concordance Universelle</h3>
              <p>L'harmonie dans la géométrie pure...</p>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/analyses" class="artistic-link">Lire les analyses</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Métahisme Section - Concept artistique -->
    <section id="metahisme" class="section metahisme-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Métahisme</h2>
          <div class="section-divider"></div>
        </div>
        <div class="metahisme-content">
          <div class="metahisme-text">
            <div class="metahisme-definition">
              <p>"Le Métahisme est un mouvement artistique créé par Patrick Laumond 
              qui explore les relations entre géométrie pure et expression émotionnelle. 
              Chaque œuvre devient une méditation sur notre époque et ses contradictions."</p>
            </div>
            <div class="metahisme-analysis">
              <p>"Un art qui transcende les frontières conventionnelles, créant un dialogue 
              entre l'ordre géométrique et le chaos émotionnel, où chaque angle droit 
              devient porteur de sens et d'émotion."</p>
            </div>
          </div>
          <div class="metahisme-visual">
            <div class="artwork-showcase">
              <img src="https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg" 
                   alt="Concordance Universelle" class="metahisme-artwork" />
              <div class="artwork-overlay">
                <h4>Concordance Universelle</h4>
                <p>L'œuvre emblématique du Métahisme</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/metahism" class="artistic-link">Découvrir le Métahisme</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Biography Section - Portrait artistique -->
    <section id="biography" class="section biography-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Biography</h2>
          <div class="section-divider"></div>
        </div>
        <div class="biography-content">
          <div class="biography-text">
            <div class="biography-intro">
              <p>Patrick Laumond développe depuis plus de vingt ans une approche 
              unique de l'expression artistique, créant un langage visuel qui 
              transcende les catégories traditionnelles.</p>
            </div>
            <div class="biography-timeline">
              <div class="timeline-item">
                <span class="year">2000</span>
                <span class="event">Début de la recherche artistique</span>
              </div>
              <div class="timeline-item">
                <span class="year">2010</span>
                <span class="event">Création du concept Métahisme</span>
              </div>
              <div class="timeline-item">
                <span class="year">2020</span>
                <span class="event">Maturation du mouvement</span>
              </div>
            </div>
          </div>
          <div class="biography-visual">
            <div class="portrait-showcase">
              <img src="https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg" 
                   alt="Patrick Laumond" class="portrait-artwork" />
              <div class="portrait-overlay">
                <h4>Patrick Laumond</h4>
                <p>Artiste et créateur du Métahisme</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section-link">
          <NuxtLink to="/biography" class="artistic-link">Lire la biographie</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer minimaliste -->
    <footer class="artistic-footer">
      <div class="footer-content">
        <div class="footer-line"></div>
        <p>&copy; 2024 Patrick Laumond</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Données des œuvres en vedette
const featuredArtworks = ref([
  {
    id: 1,
    title: "Le Portant",
    category: "Déploiement",
    imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/10.jpg"
  },
  {
    id: 2,
    title: "Concordance Universelle",
    category: "Déploiement",
    imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/02.jpg"
  },
  {
    id: 3,
    title: "Comme deux aimants",
    category: "Déploiement",
    imageUrl: "https://plaumondpicture.s3.eu-west-3.amazonaws.com/Deployments/00/06.jpg"
  }
]);
</script>

<style lang="scss" scoped>
.homepage {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
}



// Sections générales
.section {
  padding: 8rem 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  
  .section-container {
    max-width: var(--max-width-content);
    margin: 0 auto;
    width: 100%;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 6rem;
    
    .section-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 1rem;
      color: var(--color-primary);
      letter-spacing: 0.1em;
    }
    
    .section-divider {
      width: 60px;
      height: 2px;
      background: var(--color-primary);
      margin: 0 auto;
    }
  }
  
  .section-link {
    text-align: center;
    margin-top: 4rem;
  }
}

// Hero Section - Contemplatif
.hero-section {
  background: var(--color-background);
  color: var(--color-text);
  display: flex;
  align-items: center;
  padding: 8rem 2rem 6rem;
  position: relative;
  
  .hero-content {
    max-width: var(--max-width-content);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    
    .hero-text {
      .hero-title {
        font-size: 3.5rem;
        font-weight: 200;
        margin-bottom: 2rem;
        color: var(--color-primary);
        letter-spacing: 0.05em;
        line-height: 1.1;
      }
      
      .hero-subtitle {
        margin-bottom: 3rem;
        
        .subtitle-line {
          display: block;
          font-size: 1.1rem;
          color: var(--color-text-light);
          margin-bottom: 0.5rem;
          font-weight: 300;
        }
      }
      
      .hero-description {
        p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-light);
          margin-bottom: 1rem;
          font-weight: 300;
        }
      }
    }
    
    .hero-visual {
      position: relative;
      height: 400px;
      
      .geometric-shape {
        position: absolute;
        background: var(--color-primary);
        
        &.shape-1 {
          width: 120px;
          height: 120px;
          top: 0;
          left: 0;
        }
        
        &.shape-2 {
          width: 80px;
          height: 80px;
          top: 150px;
          right: 0;
        }
        
        &.shape-3 {
          width: 60px;
          height: 60px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}

// Oeuvres Section
.oeuvres-section {
  background: var(--color-background-alt);
  
  .artworks-showcase {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
    
    .artwork-item {
      position: relative;
      
      .artwork-frame {
        background: white;
        padding: 1rem;
        border: 1px solid var(--color-border);
        margin-bottom: 1rem;
        
        img {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
      }
      
      .artwork-info {
        .artwork-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: var(--color-primary);
        }
        
        .artwork-category {
          font-size: 0.9rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      }
    }
  }
}

// Analyses Section
.analyses-section {
  background: white;
  
  .analyses-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    
    .analysis-text {
      .analysis-quote {
        margin-bottom: 3rem;
        
        p {
          font-size: 1.3rem;
          line-height: 1.6;
          color: var(--color-primary);
          font-style: italic;
          margin-bottom: 1rem;
        }
        
        .quote-author {
          font-size: 0.9rem;
          color: var(--color-text-light);
        }
      }
      
      .analysis-excerpt {
        p {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--color-text-light);
        }
      }
    }
    
    .analysis-visual {
      .text-block {
        background: var(--color-background-alt);
        padding: 2rem;
        margin-bottom: 2rem;
        border-left: 3px solid var(--color-primary);
        
        h3 {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }
        
        p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-text-light);
        }
      }
    }
  }
}

// Métahisme Section
.metahisme-section {
  background: var(--color-background-alt);
  
  .metahisme-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    
    .metahisme-text {
      .metahisme-definition {
        margin-bottom: 3rem;
        
        p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--color-text-light);
        }
      }
      
      .metahisme-analysis {
        h3 {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: var(--color-primary);
        }
        
        p {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-light);
        }
      }
    }
    
    .metahisme-visual {
      .artwork-showcase {
        position: relative;
        overflow: hidden;
        background: white;
        border: 1px solid var(--color-border);
        
        .metahisme-artwork {
          width: 100%;
          height: 400px;
          object-fit: cover;
          transition: transform var(--transition-medium);
        }
        
        .artwork-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 2rem;
          transform: translateY(100%);
          transition: transform var(--transition-medium);
          
          h4 {
            font-size: 1.3rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          
          p {
            font-size: 0.9rem;
            opacity: 0.9;
          }
        }
        
        &:hover {
          .metahisme-artwork {
            transform: scale(1.05);
          }
          
          .artwork-overlay {
            transform: translateY(0);
          }
        }
      }
    }
  }
}

// Biography Section
.biography-section {
  background: white;
  
  .biography-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    
    .biography-text {
      .biography-intro {
        margin-bottom: 3rem;
        
        p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--color-text-light);
        }
      }
      
      .biography-timeline {
        .timeline-item {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          
          .year {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--color-primary);
            margin-right: 2rem;
            min-width: 60px;
          }
          
          .event {
            font-size: 0.9rem;
            color: var(--color-text-light);
          }
        }
      }
    }
    
    .biography-visual {
      .portrait-showcase {
        position: relative;
        overflow: hidden;
        background: white;
        border: 1px solid var(--color-border);
        
        .portrait-artwork {
          width: 100%;
          height: 400px;
          object-fit: cover;
          transition: transform var(--transition-medium);
        }
        
        .portrait-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 2rem;
          transform: translateY(100%);
          transition: transform var(--transition-medium);
          
          h4 {
            font-size: 1.3rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          
          p {
            font-size: 0.9rem;
            opacity: 0.9;
          }
        }
        
        &:hover {
          .portrait-artwork {
            transform: scale(1.05);
          }
          
          .portrait-overlay {
            transform: translateY(0);
          }
        }
      }
    }
  }
}

// Liens artistiques
.artistic-link {
  display: inline-block;
  text-decoration: none;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1rem 2rem;
  border: 1px solid var(--color-primary);
  transition: all var(--transition-medium);
  
  &:hover {
    background: var(--color-primary);
    color: white;
  }
}

// Footer artistique
.artistic-footer {
  background: var(--color-primary);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  
  .footer-content {
    max-width: var(--max-width-content);
    margin: 0 auto;
    
    .footer-line {
      width: 100px;
      height: 1px;
      background: white;
      margin: 0 auto 2rem;
    }
    
    p {
      font-size: 0.9rem;
      font-weight: 300;
      letter-spacing: 0.1em;
    }
  }
}

// Animations
@keyframes slideInLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Responsive
@media (max-width: 768px) {
  .hero-section .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .analyses-content,
  .metahisme-content,
  .biography-content {
    grid-template-columns: 1fr;
  }
  
  .artworks-showcase {
    grid-template-columns: 1fr;
  }
  
  .nav-links {
    display: none;
  }
  
  .section {
    padding: 6rem 1rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>

