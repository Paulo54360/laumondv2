<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-line"></div>
      <p class="footer-text">
        &copy; Patrick Laumond • Tous droits réservés - patrick@laumond.com - Paris.
        <br />Photos: &copy;Philippe Tapissier &nbsp;&nbsp; - &nbsp;&nbsp; Développement: Paul
        Convert
      </p>
      <a
        href="https://www.facebook.com/metahisme/?locale=fr_FR"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
      >
        <i class="fab fa-facebook-f"></i>
      </a>
      <a
        href=" https://www.instagram.com/metahisme/"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
      >
        <i class="fab fa-instagram"></i>
      </a>
      <a
        href="https://laumond.tumblr.com/"
        target="_blank"
        rel="noopener noreferrer"
        class="social-link"
      >
        <i class="fab fa-tumblr"></i>
      </a>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background-color: #f5f5f5;
  padding: 20px 0;
  width: 100%;
  text-align: center;
  margin-top: auto;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}

.footer-line {
  width: 100px;
  height: 1px;
  background: #333;
  margin: 0 auto 2rem;
}

.footer-text {
  display: flex;
  text-align: center;
  justify-content: center;
}

.social-links {
  margin-top: 10px;
}

.social-link {
  display: inline-block;
  margin-right: 10px;
  color: #333;
  font-size: 20px;
}

.social-link i {
  display: inline-block;
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 1024px) {
  .footer-text {
    font-size: 0.7em;
  }
}

@media screen and (max-width: 768px) {
  .footer {
    padding: 15px 0;
  }
  
  .footer-text {
    font-size: 0.6em;
    flex-direction: column;
    gap: 5px;
  }
  
  .social-link {
    margin-right: 15px;
    font-size: 18px;
  }
}

@media screen and (max-width: 480px) {
  .footer {
    padding: 10px 0;
  }
  
  .footer-text {
    font-size: 0.5em;
  }
  
  .social-link {
    margin-right: 12px;
    font-size: 16px;
  }
}
</style> 