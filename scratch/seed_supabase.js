const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Lecture des clés depuis les variables d'environnement ou le fichier .env.local
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/);
  if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].replace(/['";\r]/g, '').trim();
  if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1].replace(/['";\r]/g, '').trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Erreur : Les variables d'environnement Supabase ne sont pas configurées.");
  console.error("Veuillez créer un fichier .env.local à la racine du projet avec :");
  console.error("NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase");
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dbPath = path.join(__dirname, '..', 'src', 'lib', 'db.json');
if (!fs.existsSync(dbPath)) {
  console.error("Erreur : Le fichier db.json est introuvable.");
  process.exit(1);
}

const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function seed() {
  console.log("Début de la synchronisation des données vers Supabase Cloud...");
  console.log(`URL Supabase : ${supabaseUrl}`);

  // 1. Seed Articles
  console.log(`Insertion de ${dbData.articles.length} articles...`);
  for (const article of dbData.articles) {
    const { error } = await supabase
      .from('articles')
      .upsert({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        image_url: article.image_url,
        author: article.author,
        read_time: article.read_time,
        comments_count: article.comments_count,
        views_count: article.views_count,
        created_at: article.created_at,
        is_featured: article.is_featured,
        is_breaking: article.is_breaking,
        tags: article.tags || []
      });
    if (error) {
      console.error(`Erreur pour l'article ${article.slug} :`, error.message);
    }
  }

  // 2. Seed Vidéos
  if (dbData.videos && dbData.videos.length > 0) {
    console.log(`Insertion de ${dbData.videos.length} vidéos...`);
    for (const video of dbData.videos) {
      const { error } = await supabase
        .from('videos')
        .upsert({
          id: video.id,
          title: video.title,
          image_url: video.image_url,
          duration: video.duration,
          views_count: video.views_count,
          is_featured: video.is_featured
        });
      if (error) {
        console.error(`Erreur pour la vidéo ${video.title} :`, error.message);
      }
    }
  }

  // 3. Seed Commentaires
  if (dbData.comments && dbData.comments.length > 0) {
    console.log(`Insertion de ${dbData.comments.length} commentaires...`);
    for (const comment of dbData.comments) {
      const { error } = await supabase
        .from('comments')
        .upsert({
          id: comment.id,
          article_id: comment.article_id,
          author_name: comment.author_name,
          content: comment.content,
          created_at: comment.created_at
        });
      if (error) {
        console.error(`Erreur pour le commentaire de ${comment.author_name} :`, error.message);
      }
    }
  }

  console.log("Opération de synchronisation terminée ! Vos données sont prêtes sur Supabase.");
}

seed();
