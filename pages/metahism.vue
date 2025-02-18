<template>
 <div class="text-container">
  <h1>{{ $t('MétaHisme.Titre') }}</h1>
  <br>
  <p>{{ $t('MétaHisme.Texte') }}</p>
  <p>{{ $t('MétaHisme.Texte2') }}</p>
  <p>{{ $t('MétaHisme.Texte3') }}</p>
  <p>{{ $t('MétaHisme.Texte4,1') }}<br>
     {{ $t('MétaHisme.Texte4,2') }}<br>
     {{ $t('MétaHisme.Texte4,3') }}</p>
  <p>{{ $t('MétaHisme.Texte5') }}</p>
  <p>{{ $t('MétaHisme.Texte6,1') }}<br>
     {{ $t('MétaHisme.Texte6,2') }}</p>
  <p>{{ $t('MétaHisme.Texte7') }}</p>
  <p>{{ $t('MétaHisme.Texte8,1') }}<br>
    {{ $t('MétaHisme.Texte8,2') }}<br>
    {{ $t('MétaHisme.Texte8,3') }}</p>
  <p>{{ $t('MétaHisme.Texte9') }}</p>
  <p>{{ $t('MétaHisme.Texte10,1') }}<br>
    {{ $t('MétaHisme.Texte10,2') }}<br>
    {{ $t('MétaHisme.Texte10,3') }}</p>
  <p>{{ $t('MétaHisme.Texte11') }}</p>
  <p>{{ $t('MétaHisme.Texte12,1') }}<br>
    {{ $t('MétaHisme.Texte12,2') }}<br>
    {{ $t('MétaHisme.Texte12,3') }}<br>
    {{ $t('MétaHisme.Texte12,4') }}<br>
    {{ $t('MétaHisme.Texte12,5') }}<br>
    {{ $t('MétaHisme.Texte12,6') }}</p>
  <p id="Patrick">{{ $t('MétaHisme.Texte16') }}<br></p>
  
  <div>
    <p id="citation">{{ $t('MétaHisme.Texte13') }}<br>
      <a>{{ $t('MétaHisme.Texte14') }}</a>
    </p>
  </div>
  
  <p id="ps">{{ $t('MétaHisme.Texte15') }}</p><br>


</div>





</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Vérifier si les données sont bien chargées
console.log("Langue actuelle :", locale.value);
console.log("Titre traduit :", t('MétaHisme.Titre'));
</script>

<style scoped>
@charset "UTF-8";
.text-container {
  width: 90%;
  /* largeur de la zone de texte */
  margin: auto;
  /* centrage horizontal */
  font-size: 1.2em;
  /* taille de police */
  line-height: 1.5em;
  /* hauteur de ligne */
  padding: 0px;
  /* espacement intérieur */ }
  .text-container h1 {
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto; }
  .text-container p {
    margin: 1.2em 0;
    padding: 0;
    text-align: justify;
    /* alignement du texte */ }
  .text-container #Patrick {
    color: #525252;
    font-style: normal;
    font-weight: bold; }
  .text-container #citation {
    font-size: 1em;
    font-style: italic;
    text-align: left; }
  .text-container #ps {
    color: #999999;
    font-size: 0.8em;
    font-style: italic;
    text-align: left; }

/*# sourceMappingURL=metahisme.component.css.map */

</style>