import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function injectSeoTags(html: string): Promise<string> {
  try {
    const settings = await storage.getAllSeoSettings();
    const seo: Record<string, string> = {};
    for (const s of settings) {
      seo[s.key] = s.value;
    }

    if (seo.site_title) {
      html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.site_title)}</title>`);
    }
    if (seo.site_description) {
      if (html.includes('<meta name="description"')) {
        html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeHtml(seo.site_description)}" />`);
      } else {
        html = html.replace("</head>", `  <meta name="description" content="${escapeHtml(seo.site_description)}" />\n  </head>`);
      }
    }
    if (seo.og_title) {
      html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(seo.og_title)}" />`);
    }
    if (seo.og_description) {
      html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeHtml(seo.og_description)}" />`);
    }
    if (seo.twitter_title) {
      html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(seo.twitter_title)}" />`);
    }
    if (seo.twitter_description) {
      html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeHtml(seo.twitter_description)}" />`);
    }

    let arTags = "";
    if (seo.site_title_ar) {
      arTags += `  <meta name="title:ar" content="${escapeHtml(seo.site_title_ar)}" />\n`;
    }
    if (seo.site_description_ar) {
      arTags += `  <meta name="description:ar" content="${escapeHtml(seo.site_description_ar)}" />\n`;
    }
    if (seo.og_title_ar) {
      arTags += `  <meta property="og:title:ar" content="${escapeHtml(seo.og_title_ar)}" />\n`;
    }
    if (seo.og_description_ar) {
      arTags += `  <meta property="og:description:ar" content="${escapeHtml(seo.og_description_ar)}" />\n`;
    }
    if (arTags) {
      html = html.replace("</head>", `${arTags}  </head>`);
    }

    const faviconEntry = await storage.getSiteImage("favicon");
    if (faviconEntry && faviconEntry.imageUrl) {
      html = html.replace(
        /<link\s+rel="icon"[^>]*\/?>/,
        `<link rel="icon" type="image/png" href="${escapeHtml(faviconEntry.imageUrl)}" />`
      );
    }

    const ogImageEntry = await storage.getSiteImage("og_image");
    if (ogImageEntry && ogImageEntry.imageUrl) {
      const ogImgUrl = escapeHtml(ogImageEntry.imageUrl);
      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
        `<meta property="og:image" content="${ogImgUrl}" />`
      );
      html = html.replace(
        /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
        `<meta name="twitter:image" content="${ogImgUrl}" />`
      );
      html = html.replace(
        /"logo":\s*"[^"]*"/,
        `"logo": "${ogImageEntry.imageUrl.replace(/"/g, '\\"')}"`
      );
    }

    const orgName = seo.org_name || "The Experts";
    const orgNameAr = seo.org_name_ar || "الخبراء";
    const orgUrl = seo.org_url || "https://theexpertsjo.com";
    const orgDesc = seo.org_description || "";
    const orgDescAr = seo.org_description_ar || "";
    const orgPhone = seo.org_phone || "+962 79 0484745";

    const jsonLd = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "${orgName.replace(/"/g, '\\"')}",
      "alternateName": "${orgNameAr.replace(/"/g, '\\"')}",
      "url": "${orgUrl.replace(/"/g, '\\"')}",
      "logo": "/opengraph.png",
      "description": "${orgDesc.replace(/"/g, '\\"')}",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "${orgPhone.replace(/"/g, '\\"')}",
        "contactType": "customer service",
        "availableLanguage": ["English", "Arabic"]
      }
    }
    </script>`;

    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, jsonLd);

    return html;
  } catch (error) {
    return html;
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("/{*path}", async (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = await fs.promises.readFile(indexPath, "utf-8");
    html = await injectSeoTags(html);
    res.set("Content-Type", "text/html");
    res.send(html);
  });
}
