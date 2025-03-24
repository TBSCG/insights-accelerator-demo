# Insight Accelerator Demo

## Overview

The **Insight Accelerator Demo** provides a step-by-step guide for setting up and configuring **AI AutoTagging**,  
**Personalization**,  **Cookie Banner Integration**, **Record Visit** and  **Generate tracked visits**  in Magnolia CMS.

---

## 📌 Tagging Configuration (Auto)

### Steps to enable AI AutoTagging:

1. Open **Magnolia Admincentral** and navigate to the **Pages App**.
2. Click on the **Travel Page** checkbox or select the **Travel Main Folder Column**.
3. In the right **Selection Panel**, click on **Edit Page Properties**.
4. Go to the **Personalization** tab.
5. Check the **Use AI AutoTagging** box to enable automatic tagging.

✅ Once enabled, the system will automatically generate relevant tags.

---

## 🏷 Tagging Configuration (Manual)

### Steps to manually tag content:

1. Open **Magnolia Admincentral** and navigate to the **Tours App**.
2. Click on the **magnolia-travels** folder.
3. Existing tags will be visible under the **Tags Column** in the table.
4. To add a new tag:
    - Click on one of the travel locations or names.
    - Scroll to the bottom of the page where **Tags** are listed.
    - Click on the row to manually add a new tag.
    - Once completed the content needs to be published by clicking the publish button on the right-hand panel 
💡 **Tip:** Ensure tags are relevant for better content categorization.

---
## 👤 Personalization
### Magnolia Personalization Guide

Magnolia's personalization feature enables content customization based on visitor data, helping to deliver a more relevant user experience. This guide explores how personalization works in Magnolia, including how visitor data is used within component rules.

#### How Magnolia Personalization Works

Magnolia Personalization allows for:

- **Content targeting** based on user interests, behaviors, and attributes.
- **Component rules** that define when specific content is shown.
- **Trait-based targeting**, which uses visitor data to determine interest areas.

#### Using Visitor Data in Component Rules

The **Insights Module** in Magnolia tracks user interactions and determines areas of interest. This data is exposed through the `VisitorVoter.java` class, which allows personalization rules to be applied.

##### Exposed Traits

Magnolia allows visitor traits to be used in personalization. A key trait is **interests**, which provides insight into what a user has interacted with the most. The following conditions are available for personalization:

| Condition       | Description |
|----------------|-------------|
| `top_x`        | Select the top X interests by weight. |
| `top_x_contains` | Checks if a specific interest is within the top X interests. |

##### Example: Personalizing Content Based on Interests

A rule can be configured to display personalized content based on interests. For example:

- **Condition:** `top_x_contains = beach,5`
- **Result:** The visitor is shown beach-related content if "beach" is within their top 5 highest weighted interests.

#### Creating Personalization Rules in Magnolia

1. Go to the **Magnolia Admin Panel** and navigate to the **Personalization app**.
2. Select the content component you want to personalize.
3. Add a **new variant** and define the rule using visitor traits.
4. Configure conditions, such as `top_x_contains = beach,5`.
5. Save and **publish** the personalization rule.

#### Conclusion

Magnolia’s personalization feature allows content to be dynamically adjusted based on visitor interests. By leveraging visitor traits such as **interests**, organizations can create targeted and relevant content experiences.

---

## 📊 Record Visit - Functionality Overview

The **Record Visit** feature tracks user interactions with the website, helping analyze visitor behavior
and preferences. Below are the key aspects of how this functionality works.

1. Page Visit Tracking
    - The system monitors the pages users visit using a tracking script (getTrackJS) that dynamically generates tracking
      URLs.
    - It determines the type of page the user views—whether it's a tour page, a tour category, or another section
      of the site.
    - Based on the page type, it logs relevant tracking information to capture user interest.

2. How Tracking Works
   The system dynamically generates tracking scripts and attaches them to the webpage. These scripts:

    - Capture the page's unique identifier.
    - Track visits based on page type (e.g., individual tours vs. categories).
    - Support automatic tagging for deeper visitor insights.

For example:

- If a user visits a tour page, it records it under the category "tours".
- If the user visits a tour category, it logs the category ID.
- For other pages, it logs the page path.

3. Storing Visitor Data
   The system stores visitor interactions to enhance user experience:

    - Recently Viewed Pages: The system remembers pages a visitor has recently browsed (unless explicitly excluded).
    - Interest Recording: If a page has associated topics, the system logs user interests by analyzing content tags.
    - Visitor Data Management: The system retrieves stored visitor data, such as favorites and browsing history, to
      offer personalized recommendations.

4. Script Execution & Integration
    - JavaScript files are loaded dynamically to ensure tracking scripts execute properly.
    - The system integrates tracking with a content management system (CMS), making it easy to analyze user activity.
    - If a page includes topic-based metadata, the system records visitor preferences based on tags, weight, and decay
      settings.

5. Purpose of the Functionality
   The Record Visit feature helps in:

    - Understanding user behavior: Tracks pages visited, interests, and browsing patterns.
    - Improving recommendations: Uses visitor history to personalize content.
    - Optimizing site engagement: Provides insights into which pages or categories attract the most attention.

---

## 🍪 Cookie Banner Integration

### Steps to configure the Cookie Banner:

1. Open **Magnolia Admincentral** and navigate to the **Pages App**.
2. Click on the **Travel Page** checkbox or select the **Travel Main Folder Column**.
3. In the right **Selection Panel**, click on **Edit Page Properties**.
4. Navigate to the **Cookie Consent** tab.
5. Select the **Compliance Type** dropdown and choose the appropriate option.
6. Fill in all required fields accordingly and add an **internal/external link**.
7. Move to the **Cookie Consent** customization tab.
8. Configure the **position**, **style**, **color**, and **button settings** of the banner.
9. Once completed the content needs to be published by clicking the publish button on the right-hand panel

---

## 📘 Stitching

### Overview 

The RegistrationProcessor class is from Magnolia's Public User Registration module. It processes user registration forms, integrates with a ProfileIdentificationService, and ensures user profile creation and updates.

### Functionality

The RegistrationProcessor ensures that user profiles are created or updated during registration. It retrieves user information from the Magnolia context and fetches the current profile ID using ProfileIdentificationService. Based on profile existence, it either assigns a UUID to a new profile or saves a registered username to an existing profile.

- Check if the profile is named:

    - If not, check if the profile has a named identifier.

    - If no named profile exists, assign a UUID to the username.

- Otherwise, save the registered username.

1. When the user goes to the page and does NOT ACCEPT cookies, every time a new session is created (e. g. new browser, restart browser) different user UUID is created by Magnolia.
2. When the user goes to the page and ACCEPT cookies, his UUID is saved to the database "visitor" and cookie. Every time he visits a page from the same browser - the user UUID is the same data about interests is gathered and content is personalized
3. When the user accepts cookies and registers, his anonymous UUID and user name are saved to the database "visitor" and table "profilesAssociation." This creates part of the association.
4. When the user logs in from a browser that has fetched an anonymous UUID, he gets a named_id that is assigned to the anonymous UUID. Then, the full association is created.
5. When the user logs in from a different browser or, different sessions to the same account, his two anonymous UUIDs are connected to a known profile.
   Then personalized content is displayed from all connected anonymous profiles.
   Example: User exploring sports travels from one browser and the other fetched browser user explores family travels, when logging in content from both will be displayed because profiles are associated.

#### How to use this?

The client must handle the registration process and save registered users (newsletter, registration, etc.) by his own.
  
The RegistrationProcessor class plays a crucial role in managing user registrations by linking user identities with system profiles, ensuring consistency and integration within Magnolia’s user management framework.

---

## ⚡ Generate tracked visits

### Steps to generate tracked visits to the public environment:

1. Open **Magnolia Admincentral** and navigate to the **Insight Accelerator App**.
2. Click on the **Individual Tab**.
3. Find your **Visitor ID** from the Left Panel
4. Fill in all required fields accordingly.
5. Navigate to the **Visitor ID** table.
6. Select the **Visitor ID** and click.
7. Click the Green **Generate Summary** button.
8. This will allow the AI to produce the visitor's interest according to the recent activities and generate the Text.

## 📘 Additional Resources

- [Magnolia Documentation](https://www.magnolia-cms.com/)
- [INSTALLATION&ADMINISTRATION](https://github.com/TBSCG/insights-accelerator-demo/blob/main/doc/public/INSTALLATION%26ADMINISTRATION.md)

📢 **Need Help?** Reach out to the Insight Accelerator Team

---

✨ **Created with ❤️ by Insight Accelerator Team** ✨

