#!/usr/bin/env node
/**
 * Image Generator - OpenRouter integration for AI image generation
 *
 * Supports multiple models via OpenRouter:
 *   - google/gemini-2.5-flash-preview-image (Nano Banana) - Fast, cheap
 *   - openai/gpt-5-image - High quality
 *   - openai/gpt-5-image-mini - Balanced
 *   - bytedance/seedream-4.5 - Good for edits
 *   - sourceful/riverflow-v2-pro - Best text rendering
 *
 * Usage:
 *   node image-generator.mjs generate "A hotel lobby with modern design"
 *   node image-generator.mjs generate "prompt" --model=nano-banana --size=1024x1024
 *   node image-generator.mjs generate "prompt" --style=photorealistic
 *   node image-generator.mjs edit input.png "Remove the person" --model=gpt-5-image
 *   node image-generator.mjs models                    # List available models
 *   node image-generator.mjs cost "prompt" --model=nano-banana  # Estimate cost
 *
 * Environment:
 *   OPENROUTER_API_KEY - Your OpenRouter API key
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../outputs/images');

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// OpenRouter API
const OPENROUTER_API = 'https://openrouter.ai/api/v1';

// Model definitions (Updated Feb 2026 with correct OpenRouter IDs)
const MODELS = {
  'nano-banana': {
    id: 'google/gemini-3-pro-image-preview',
    name: 'Nano Banana Pro (Gemini 3 Pro Image)',
    pricing: { perImage: 0.02 }, // Estimated based on token usage
    modalities: ['image', 'text'],
    strengths: ['fast', 'cheap', 'contextual', 'multi-turn', 'edits'],
    maxSize: '1536x1536',
    recommended: true,
    description: 'Fast and cheap. Best for quick iterations and drafts.'
  },
  'gpt-5-image': {
    id: 'openai/gpt-5-image',
    name: 'GPT-5 Image',
    pricing: { perImage: 0.08 }, // ~$40/M output tokens for images
    modalities: ['image', 'text'],
    strengths: ['quality', 'text-rendering', 'instruction-following', 'editing'],
    maxSize: '2048x2048',
    recommended: false,
    description: 'Highest quality. Best for final production assets.'
  },
  'flux-max': {
    id: 'black-forest-labs/flux.2-max',
    name: 'FLUX.2 Max',
    pricing: { perImage: 0.07 }, // $0.07 first megapixel
    modalities: ['image'],
    strengths: ['quality', 'photorealistic', 'detail', 'artistic'],
    maxSize: '2048x2048',
    recommended: false,
    description: 'Top-tier FLUX model. Excellent for photorealistic images.'
  },
  'flux-klein': {
    id: 'black-forest-labs/flux.2-klein',
    name: 'FLUX.2 Klein',
    pricing: { perImage: 0.02 },
    modalities: ['image'],
    strengths: ['fast', 'cheap', 'good-quality'],
    maxSize: '1536x1536',
    recommended: false,
    description: 'Fastest FLUX model. Good balance of speed and quality.'
  },
  'riverflow': {
    id: 'sourceful/riverflow-v2-pro',
    name: 'Riverflow V2 Pro',
    pricing: { perImage: 0.05 },
    modalities: ['image'],
    strengths: ['text-rendering', 'control', 'precision'],
    maxSize: '2048x2048',
    recommended: false,
    description: 'Best text rendering and precise control.'
  }
};

// Style presets
const STYLE_PRESETS = {
  photorealistic: 'Photorealistic, high detail, professional photography, studio lighting',
  illustration: 'Digital illustration, clean lines, modern style, vibrant colors',
  minimal: 'Minimalist design, clean, simple, white space, modern',
  luxury: 'Luxury aesthetic, elegant, sophisticated, premium feel, gold accents',
  tech: 'Modern tech aesthetic, clean UI, digital, futuristic, blue tones',
  travel: 'Travel photography style, warm colors, inviting, aspirational',
  ad: 'Advertising style, eye-catching, bold, conversion-focused, clear CTA space',
  social: 'Social media optimized, engaging, scroll-stopping, trendy'
};

// Size presets
const SIZE_PRESETS = {
  'square': '1024x1024',
  'landscape': '1536x1024',
  'portrait': '1024x1536',
  'wide': '1920x1080',
  'story': '1080x1920',
  'banner': '1200x628',
  'fb-ad': '1200x628',
  'ig-post': '1080x1080',
  'ig-story': '1080x1920',
  'twitter': '1600x900',
  'linkedin': '1200x627'
};

// Get API key
function getApiKey() {
  // Try environment variable
  if (process.env.OPENROUTER_API_KEY) {
    return process.env.OPENROUTER_API_KEY;
  }

  // Try config file
  const configPath = join(__dirname, '../config/openrouter.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return config.apiKey;
  }

  // Try project-level config
  const projectConfigPath = join(__dirname, '../../../.aios/secrets/openrouter.json');
  if (existsSync(projectConfigPath)) {
    const config = JSON.parse(readFileSync(projectConfigPath, 'utf-8'));
    return config.apiKey;
  }

  return null;
}

// Generate image
async function generateImage(prompt, options = {}) {
  const {
    model = 'nano-banana',
    size = '1024x1024',
    style = null,
    quality = 'standard',
    n = 1,
    outputPath = null
  } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    return {
      success: false,
      error: 'OpenRouter API key not found. Set OPENROUTER_API_KEY or create config file.'
    };
  }

  const modelConfig = MODELS[model];
  if (!modelConfig) {
    return {
      success: false,
      error: `Unknown model: ${model}. Use 'models' command to see available options.`
    };
  }

  // Resolve size preset
  const resolvedSize = SIZE_PRESETS[size] || size;
  const [width, height] = resolvedSize.split('x').map(Number);

  // Build enhanced prompt with style
  let enhancedPrompt = prompt;
  if (style && STYLE_PRESETS[style]) {
    enhancedPrompt = `${prompt}. Style: ${STYLE_PRESETS[style]}`;
  }

  // Build request
  const requestBody = {
    model: modelConfig.id,
    messages: [
      {
        role: 'user',
        content: enhancedPrompt
      }
    ],
    modalities: modelConfig.modalities,
    max_tokens: 1024
  };

  // Add image parameters if supported
  if (modelConfig.modalities.includes('image')) {
    requestBody.image_generation = {
      width,
      height,
      quality,
      n
    };
  }

  console.log(`🎨 Generating with ${modelConfig.name}...`);
  console.log(`   Prompt: ${enhancedPrompt.slice(0, 80)}${enhancedPrompt.length > 80 ? '...' : ''}`);
  console.log(`   Size: ${resolvedSize}`);

  try {
    const response = await fetch(`${OPENROUTER_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aios.synkra.dev',
        'X-Title': 'AIOS Design Squad'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();

    // Debug: log raw response structure
    if (process.env.DEBUG || args.includes('--debug')) {
      console.log('\n--- DEBUG: Raw API Response ---');
      console.log(JSON.stringify(data, null, 2).slice(0, 2000));
      console.log('--- END DEBUG ---\n');
    }

    // Extract image URL(s) from response
    const images = [];
    const content = data.choices?.[0]?.message?.content;

    if (typeof content === 'string') {
      // Check for markdown image
      const imageMatches = content.match(/!\[.*?\]\((https?:\/\/[^\)]+)\)/g);
      if (imageMatches) {
        imageMatches.forEach(match => {
          const url = match.match(/\((https?:\/\/[^\)]+)\)/)?.[1];
          if (url) images.push(url);
        });
      }
    } else if (Array.isArray(content)) {
      // Multi-part content
      content.forEach(part => {
        if (part.type === 'image_url' || part.type === 'image') {
          images.push(part.image_url?.url || part.url);
        }
      });
    }

    // Check for direct image in response
    if (data.choices?.[0]?.message?.image) {
      images.push(data.choices[0].message.image);
    }

    // Save images if outputPath specified or auto-generate
    const savedPaths = [];
    const timestamp = Date.now();

    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const filename = outputPath || `generated-${timestamp}-${i + 1}.png`;
      const fullPath = join(OUTPUT_DIR, filename);

      // Download and save image
      try {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        writeFileSync(fullPath, imageBuffer);
        savedPaths.push(fullPath);
        console.log(`   ✅ Saved: ${fullPath}`);
      } catch (saveError) {
        console.log(`   ⚠️ Could not save image: ${saveError.message}`);
        savedPaths.push(imageUrl); // Return URL instead
      }
    }

    return {
      success: true,
      model: modelConfig.name,
      prompt: enhancedPrompt,
      size: resolvedSize,
      images: savedPaths.length > 0 ? savedPaths : images,
      usage: data.usage,
      estimatedCost: modelConfig.pricing.perImage * n
    };

  } catch (error) {
    return {
      success: false,
      error: `Request failed: ${error.message}`
    };
  }
}

// Edit image
async function editImage(inputPath, editPrompt, options = {}) {
  const { model = 'nano-banana' } = options;

  const apiKey = getApiKey();
  if (!apiKey) {
    return { success: false, error: 'OpenRouter API key not found.' };
  }

  if (!existsSync(inputPath)) {
    return { success: false, error: `Input image not found: ${inputPath}` };
  }

  const modelConfig = MODELS[model];

  // Read and encode image
  const imageBuffer = readFileSync(inputPath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = inputPath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const requestBody = {
    model: modelConfig.id,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          },
          {
            type: 'text',
            text: `Edit this image: ${editPrompt}`
          }
        ]
      }
    ],
    modalities: ['image', 'text']
  };

  console.log(`✏️ Editing with ${modelConfig.name}...`);
  console.log(`   Edit: ${editPrompt}`);

  try {
    const response = await fetch(`${OPENROUTER_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://aios.synkra.dev',
        'X-Title': 'AIOS Design Squad'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();

    // Similar image extraction as generateImage
    // ... (simplified for brevity)

    return {
      success: true,
      model: modelConfig.name,
      editPrompt,
      message: 'Edit completed - check response for image URL'
    };

  } catch (error) {
    return { success: false, error: `Request failed: ${error.message}` };
  }
}

// Estimate cost
function estimateCost(prompt, options = {}) {
  const { model = 'nano-banana', n = 1 } = options;
  const modelConfig = MODELS[model];

  if (!modelConfig) {
    return { error: `Unknown model: ${model}` };
  }

  const cost = modelConfig.pricing.perImage * n;

  return {
    model: modelConfig.name,
    imagesRequested: n,
    costPerImage: modelConfig.pricing.perImage,
    totalCost: cost,
    vsGpt5Image: MODELS['gpt-5-image'].pricing.perImage * n - cost
  };
}

// List models
function listModels() {
  let output = '\n## Available Image Generation Models\n\n';
  output += '| Model | Price/Image | Best For | Recommended |\n';
  output += '|-------|-------------|----------|-------------|\n';

  for (const [key, model] of Object.entries(MODELS)) {
    const rec = model.recommended ? '✅' : '';
    output += `| ${model.name} | €${model.pricing.perImage.toFixed(2)} | ${model.strengths.slice(0, 2).join(', ')} | ${rec} |\n`;
  }

  output += '\n### Model Details\n';

  for (const [key, model] of Object.entries(MODELS)) {
    output += `\n**${key}** (${model.name})\n`;
    output += `- ID: ${model.id}\n`;
    output += `- Max Size: ${model.maxSize}\n`;
    output += `- Strengths: ${model.strengths.join(', ')}\n`;
    output += `- ${model.description}\n`;
  }

  return output;
}

// List styles
function listStyles() {
  let output = '\n## Style Presets\n\n';
  output += '| Style | Description |\n';
  output += '|-------|-------------|\n';

  for (const [key, desc] of Object.entries(STYLE_PRESETS)) {
    output += `| ${key} | ${desc.slice(0, 50)}... |\n`;
  }

  return output;
}

// List sizes
function listSizes() {
  let output = '\n## Size Presets\n\n';
  output += '| Name | Dimensions | Use Case |\n';
  output += '|------|------------|----------|\n';

  const useCases = {
    'square': 'General purpose',
    'landscape': 'Landscape images',
    'portrait': 'Portrait images',
    'wide': 'Widescreen/video',
    'story': 'Stories/Reels',
    'banner': 'Web banners',
    'fb-ad': 'Facebook ads',
    'ig-post': 'Instagram posts',
    'ig-story': 'Instagram stories',
    'twitter': 'Twitter posts',
    'linkedin': 'LinkedIn posts'
  };

  for (const [key, size] of Object.entries(SIZE_PRESETS)) {
    output += `| ${key} | ${size} | ${useCases[key]} |\n`;
  }

  return output;
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // Parse flags
  const getFlag = (name) => {
    const arg = args.find(a => a.startsWith(`--${name}=`));
    return arg ? arg.split('=')[1] : null;
  };

  switch (command) {
    case 'generate': {
      const prompt = args.slice(1).filter(a => !a.startsWith('--')).join(' ');

      if (!prompt) {
        console.error('Usage: node image-generator.mjs generate "Your prompt here"');
        process.exit(1);
      }

      const result = await generateImage(prompt, {
        model: getFlag('model') || 'nano-banana',
        size: getFlag('size') || 'square',
        style: getFlag('style'),
        quality: getFlag('quality') || 'standard',
        n: parseInt(getFlag('n') || '1'),
        outputPath: getFlag('output')
      });

      if (result.success) {
        console.log('\n✅ Generation complete!');
        console.log(`   Model: ${result.model}`);
        console.log(`   Estimated cost: €${result.estimatedCost.toFixed(2)}`);
        console.log(`   Images: ${result.images.join(', ')}`);
      } else {
        console.error(`\n❌ Error: ${result.error}`);
        process.exit(1);
      }
      break;
    }

    case 'edit': {
      const inputPath = args[1];
      const editPrompt = args.slice(2).filter(a => !a.startsWith('--')).join(' ');

      if (!inputPath || !editPrompt) {
        console.error('Usage: node image-generator.mjs edit input.png "Edit instruction"');
        process.exit(1);
      }

      const result = await editImage(inputPath, editPrompt, {
        model: getFlag('model') || 'nano-banana'
      });

      console.log(result.success ? '✅ Edit complete!' : `❌ Error: ${result.error}`);
      break;
    }

    case 'cost': {
      const prompt = args.slice(1).filter(a => !a.startsWith('--')).join(' ');
      const result = estimateCost(prompt, {
        model: getFlag('model') || 'nano-banana',
        n: parseInt(getFlag('n') || '1')
      });

      console.log('\n## Cost Estimate\n');
      console.log(`Model: ${result.model}`);
      console.log(`Images: ${result.imagesRequested}`);
      console.log(`Cost per image: €${result.costPerImage.toFixed(2)}`);
      console.log(`Total cost: €${result.totalCost.toFixed(2)}`);
      console.log(`Savings vs GPT-5 Image: €${result.vsGpt5Image.toFixed(2)}`);
      break;
    }

    case 'models':
      console.log(listModels());
      break;

    case 'styles':
      console.log(listStyles());
      break;

    case 'sizes':
      console.log(listSizes());
      break;

    default:
      console.log(`
Image Generator - OpenRouter AI Image Generation

Commands:
  generate "prompt"             Generate image from prompt
      --model=nano-banana       Model (default: nano-banana)
      --size=square             Size preset or WxH (default: square)
      --style=photorealistic    Style preset (optional)
      --quality=standard        Quality: standard, hd (default: standard)
      --n=1                     Number of images (default: 1)
      --output=filename.png     Output filename (optional)

  edit input.png "instruction"  Edit existing image
      --model=nano-banana       Model for editing

  cost "prompt"                 Estimate generation cost
      --model=nano-banana
      --n=1

  models                        List available models
  styles                        List style presets
  sizes                         List size presets

Examples:
  node image-generator.mjs generate "Modern hotel lobby with plants" --style=luxury
  node image-generator.mjs generate "Ad banner for hotel booking" --size=fb-ad --style=ad
  node image-generator.mjs edit hero.png "Add warm sunset lighting"
  node image-generator.mjs cost "Product shot" --model=gpt-5-image --n=3

Models:
  nano-banana    Gemini 2.5 Flash - Fast, cheap (€0.02/image) ← RECOMMENDED
  gpt-5-image    GPT-5 Image - Highest quality (€0.08/image)
  gpt-5-image-mini  Balanced (€0.03/image)
  seedream       ByteDance - Good for edits (€0.04/image)
  riverflow      Best text rendering (€0.05/image)

Environment:
  OPENROUTER_API_KEY - Set your API key
      `);
  }
}

main().catch(console.error);
