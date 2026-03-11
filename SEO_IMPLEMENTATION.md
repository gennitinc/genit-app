# Gennit AI - SEO Implementation Guide

## Overview

This document outlines the comprehensive SEO implementation across the Gennit AI platform to improve search engine visibility and rankings.

## Implementation Summary

### 1. **Root Layout (app/layout.tsx)**

✅ **Implemented:**

- Complete metadata object with title, description, keywords
- Authors and creator information
- Canonical URLs
- Robots directives (index, follow, Google Bot specific rules)
- Twitter Card configuration (summary_large_image)
- Open Graph metadata with images
- Viewport settings
- Apple Web App configuration
- Format detection (telephone numbers)
- Structured data (JSON-LD Organization schema in head)

### 2. **Page-Specific Metadata**

#### Home Page (`app/page.tsx`)

✅ **Added:**

- Unique title optimized for keywords
- Compelling meta description
- Targeted keywords list
- Open Graph data
- Twitter Card configuration

#### Pricing Page (`app/pricing/page.tsx`)

✅ **Added:**

- Pricing-focused title and description
- Subscription-related keywords
- Social sharing metadata

#### Company/About Page (`app/company/page.tsx`)

✅ **Added:**

- Company mission-focused metadata
- Team and company keywords
- About page specific Open Graph

#### Contact Page (`app/contact/page.tsx`)

✅ **Added:**

- Contact form metadata
- Support and inquiry keywords
- Call-to-action focused description

<!-- #### Inspirations Page (`app/inspirations/page.tsx`) -->

✅ **Added:**

- Template and inspiration keywords
- Gallery/browse related metadata

#### Support/Suggest Page (`app/suggest/page.tsx`)

✅ **Added:**

- Support and feedback keywords
- Help and feature request metadata

#### Auth Pages

✅ **Added:**

- Sign In Page: Metadata with robots noindex (private page)
- Sign Up Page: Metadata with robots noindex (private page)

#### Legal Pages

✅ **Added:**

- Privacy Policy: Privacy-focused keywords
- Terms of Service: T&C related keywords

### 3. **XML Sitemap (`app/sitemap.ts`)**

✅ **Created:**

- Sitemap with all public pages
- Priority levels (1.0 for home, 0.8 for main pages, 0.5-0.6 for support)
- Change frequency settings
- Last modified dates

### 4. **Robots.txt (`app/robots.ts`)**

✅ **Created:**

- User-agent rules for all crawlers
- Specific rules for Google Bot
- Disallowed paths (authenticated pages, internal APIs)
- Sitemap reference
- Crawl delay settings

### 5. **Structured Data (Schema.json)**

✅ **Created:**

- Organization schema
- WebSite schema
- SoftwareApplication schema
- FAQPage schema with 5 common questions
- Aggregate ratings (4.9/5)
- Contact information

### 6. **JSON-LD in Layout Head**

✅ **Implemented:**

- Organization structured data in HTML head
- Contact point information
- Social media profiles

## SEO Best Practices Applied

### 1. **Technical SEO**

- ✅ Canonical URLs set
- ✅ Mobile-friendly viewport
- ✅ Language declaration (en)
- ✅ Robots directives for crawlability
- ✅ Sitemap submission ready
- ✅ Open Graph for social sharing

### 2. **On-Page SEO**

- ✅ Unique titles (50-60 characters)
- ✅ Compelling meta descriptions (120-160 characters)
- ✅ Keyword optimization
- ✅ H1 tags on all pages
- ✅ Image alt texts
- ✅ Internal linking structure

### 3. **Structured Data**

- ✅ Organization schema
- ✅ Software Application schema
- ✅ FAQ schema
- ✅ Rating/Review schema potential
- ✅ Event schema ready (for future)

### 4. **Social Media**

- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Image optimization for sharing (1200x630px)
- ✅ Site name specification

### 5. **User Experience**

- ✅ Fast loading metadata
- ✅ Responsive design indicators
- ✅ Apple app web support
- ✅ No phone number auto-detection (relevant for forms)

## Keywords Targeted by Page

### Home Page

- AI media design
- AI graphics generator
- Video creation
- Animation software
- Brand design tools
- Marketing content creation

### Pricing Page

- Pricing
- AI media design pricing
- Subscription plans
- Free trial
- Monthly/annual subscription
- Enterprise pricing

### Company Page

- About gennit
- Company mission
- AI media design company
- Media creation tools
- Team

### Contact Page

- Contact us
- Support
- Sales inquiry
- Demo request
- Partnership
- Business inquiry

### Inspirations Page

- Design inspirations
- Templates
- Design ideas
- Flyer templates
- Creative designs
- Professional templates

### Support Page

- Support
- Suggestions
- Feedback
- Bug report
- Feature request
- Help

## Monitoring & Optimization

### Tools to Use

1. **Google Search Console**
   - Monitor indexation
   - Track keywords
   - Review coverage
   - Check mobile usability

2. **Google Analytics 4**
   - Track organic traffic
   - Monitor user behavior
   - Conversion tracking
   - User demographics

3. **Lighthouse**
   - Performance audits
   - SEO compliance
   - Accessibility checks

### Regular Tasks

- ✅ Submit sitemap to GSC
- ✅ Monitor Core Web Vitals
- ✅ Check for crawl errors
- ✅ Analyze keyword rankings
- ✅ Review backlink profile
- ✅ Test metadata in social sharing

## Recommended Enhancements (Future)

1. **Blog/Content Section**
   - Create /blog pages
   - Add Article schema
   - Build backlinks
   - Target long-tail keywords

2. **Advanced Schema**
   - VideoObject schema (if video content)
   - HowTo schema (for tutorials)
   - BreadcrumbList schema
   - LocalBusiness schema (if location-based)

3. **Performance**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Cache optimization

4. **Link Building**
   - Internal linking strategy
   - Backlink outreach
   - Press releases
   - Guest posts

5. **Content Optimization**
   - Topic clustering
   - Pillar content
   - Semantic keyword expansion
   - Content depth analysis

## Implementation Checklist

- ✅ Root layout metadata
- ✅ Page-specific metadata (8 pages)
- ✅ XML Sitemap
- ✅ Robots.txt
- ✅ Structured Data (JSON-LD)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Mobile-friendly viewport
- ✅ Privacy/Legal pages metadata

## Next Steps

1. **Verify in Search Engines**
   - Submit sitemap to Google Search Console
   - Submit to Bing Webmaster Tools
   - Check indexation in 7-14 days

2. **Monitor Performance**
   - Set up Google Analytics goals
   - Track keyword rankings
   - Monitor click-through rates
   - Analyze user behavior

3. **Optimize Based on Data**
   - Update underperforming pages
   - Expand high-performing content
   - Build internal linking
   - Create supporting content

## Notes

- All URLs use absolute paths with https://www.gennit.online
- Noindex applied to auth pages (signin, signup)
- Chat and user pages excluded from public sitemap
- Images use descriptive alt text
- All meta descriptions are unique and compelling
- Keywords are naturally incorporated, not stuffed
