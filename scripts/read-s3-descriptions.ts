import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: 'eu-west-3',
});

async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

async function listAndReadTextFiles() {
  try {
    // Liste tous les objets dans le bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: 'plaumondpicture',
    });

    const data = await s3Client.send(listCommand);
    
    if (!data.Contents) {
      console.log('Aucun fichier trouvé dans le bucket');
      return;
    }

    // Filtre pour ne garder que les fichiers .txt
    const textFiles = data.Contents.filter(file => file.Key?.endsWith('.txt'));

    console.log(`\nFichiers .txt trouvés : ${textFiles.length}\n`);

    // Lit le contenu de chaque fichier .txt
    for (const file of textFiles) {
      if (!file.Key) continue;

      const getCommand = new GetObjectCommand({
        Bucket: 'plaumondpicture',
        Key: file.Key,
      });

      try {
        const response = await s3Client.send(getCommand);
        if (response.Body instanceof Readable) {
          const content = await streamToString(response.Body);
          console.log(`\n=== ${file.Key} ===`);
          console.log(content);
        }
      } catch (error) {
        console.error(`Erreur lors de la lecture de ${file.Key}:`, error);
      }
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

listAndReadTextFiles(); 