// Configuration PM2 avec variables d'environnement
// À placer à la racine de votre application sur le serveur

module.exports = {
  apps: [{
    name: 'laumond-nuxt',
    script: 'server/index.mjs',
    cwd: '/chemin/vers/votre-app', // ⚠️ À modifier avec votre chemin réel
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // ⚠️ REMPLACEZ par vos vraies valeurs
      SUPABASE_URL: 'https://xxxxx.supabase.co',
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      NUXT_PUBLIC_API_URL: 'https://plaumondpicture.s3.eu-west-3.amazonaws.com'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M',
    watch: false
  }]
};

