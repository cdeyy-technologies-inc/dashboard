# reference

https://nextjs.org/learn/dashboard-app

For this course, we'll build a financial dashboard that has:

    A public home page.
    A login page.
    Dashboard pages that are protected by authentication.
    The ability for users to add, edit, and delete invoices.

The dashboard will also have an accompanying database.

By the end of the demo, you'll observe the essential skills needed to start building full-stack Next.js applications.

Here's an overview of features demoed:

        Styling: The different ways to style your application in Next.js.
        Optimizations: How to optimize images, links, and fonts.
        Routing: How to create nested layouts and pages using file-system routing.
        Data Fetching: How to set up a Postgres database on Vercel, and best practices for fetching and streaming.
        Search and Pagination: How to implement search and pagination using URL search params.
        Mutating Data: How to mutate data using React Server Actions, and revalidate the Next.js cache.
        Error Handling: How to handle general and 404 not found errors.
        Form Validation and Accessibility: How to do server-side form validation and tips for improving accessibility.
        Authentication: How to add authentication to your application using NextAuth.js
        and Middleware.
        Metadata: How to add metadata and prepare your application for social sharing.

## Getting Started

### Creating a new project

We recommend using pnpm as your package manager, as it's faster and more efficient than npm or yarn:

        npm install -g pnpm

then:

        npx create-next-app@latest nextjs-dashboard --example "https://github.com/vercel/next-learn/tree/main/dashboard/starter-example" --use-pnpm


### Placeholder data

When you're building user interfaces, it helps to have some placeholder data. If a database or API is not yet available, you can:

    Use placeholder data in JSON format or as JavaScript objects.
    Use a 3rd party service like [mockAPI](https://mockapi.io/)

If you're a TypeScript developer:

    We're manually declaring the data types, but for better type-safety, we recommend Prisma or Drizzle , which automatically generates types based on your database schema.  
    
    Next.js detects if your project uses TypeScript and automatically installs the necessary packages and configuration. Next.js also comes with a [TypeScript plugin](https://nextjs.org/docs/app/building-your-application/configuring/typescript#typescript-plugin) for your code editor, to help with auto-completion and type-safety.


### CSS Styling

Here are the topics we’ll cover

        How to add a global CSS file to your application.

        Two different ways of styling: Tailwind and CSS modules.

        How to conditionally add class names with the clsx utility package.

#### Global styles

in app/ui/global.css, it adds CSS rules to all the routes in the app.

You can import global.css in any component in your application, but it's usually good practice to add it to your top-level component. In Next.js, this is the root layout (more on this later).

##### Use Tailwind

Tailwind
is a CSS framework that speeds up the development process by allowing you to quickly write utility classes

directly in your React code.

In Tailwind, you style elements by adding class names. For example, adding "text-blue-500" will turn the <h1> text blue

        <h1 className="text-blue-500">I'm blue!</h1>

Although the CSS styles are shared globally, each class is singularly applied to each element. This means if you add or delete an element, you don't have to worry about maintaining separate stylesheets, style collisions, or the size of your CSS bundle growing as your application scales.

Tailwind and CSS modules are the two most common ways of styling Next.js applications. Whether you use one or the other is a matter of preference - you can even use both in the same application!

##### Using the clsx library to toggle class names

There may be cases where you may need to conditionally style an element based on state or some other condition.

[clsx](https://www.npmjs.com/package/clsx)
is a library that lets you toggle class names easily. We recommend taking a look at [documentation](https://github.com/lukeed/clsx)

for more details, but here's the basic usage:

    Suppose that you want to create an InvoiceStatus component which accepts status. The status can be 'pending' or 'paid'.
    If it's 'paid', you want the color to be green. If it's 'pending', you want the color to be gray.

You can use clsx to conditionally apply the classes, like this:

##### Other styling solutions

In addition to the approaches we've discussed, you can also style your Next.js application with:

    Sass which allows you to import .css and .scss files.
    CSS-in-JS libraries such as styled-jsx

, styled-components
, and emotion

    .

Take a look at the CSS documentation for more information.

### Optimizing Fonts and Images

Let's continue working on your home page by adding a custom font and a hero image.

Let's cover these topics:

        How to optimize fonts in Next.js using the next/font module.
        How to optimize images in Next.js using the next/image component.
        How founts and images are optimized in Next.js

[Cumulative Layout Shift](https://vercel.com/blog/how-core-web-vitals-affect-seo)
is a metric used by Google to evaluate the performance and user experience of a website. With fonts, layout shift happens when the browser initially renders text in a fallback or system font and then swaps it out for a custom font once it has loaded. This swap can cause the text size, spacing, or layout to change, shifting elements around it.

Next.js automatically optimizes fonts in the application when you use the next/font module. It downloads font files at build time and hosts them with your other static assets. This means when a user visits your application, there are no additional network requests for fonts which would impact performance.


#### Adding a primary font

By adding Inter to the <body> element, the font will be applied throughout your application. Here, you're also adding the Tailwind antialiased
class which smooths out the font. It's not necessary to use this class, but it adds a nice touch.

#### Adding a secondary font

Now it's your turn! In your fonts.ts file, import a secondary font called Lusitana and pass it to the <p> element in your /app/page.tsx file. In addition to specifying a subset like you did before, you should also specify different font weights. For example, 400 (normal) and 700 (bold).

Hints:

    If you're unsure what weight options to pass to a font, check the TypeScript errors in your code editor.
    Visit the Google Fonts website and search for Lusitana to see what options are available.
    See the documentation for adding multiple fonts and the full list of options.

#### Why optimize images?

Next.js can serve static assets, like images, under the top-level /public folder. Files inside /public can be referenced in your application.

With regular HTML, you would add an image as follows:

        <img
          src="/hero.png"
          alt="Screenshots of the dashboard project showing desktop version"
        />

However, this means you have to manually:

        Ensure your image is responsive on different screen sizes.
        Specify image sizes for different devices.
        Prevent layout shift as the images load.
        Lazy load images that are outside the user's viewport.

Image Optimization is a large topic in web development that could be considered a specialization in itself. Instead of manually implementing these optimizations, you can use the next/image component to automatically optimize your images.

#### The <Image> component

The <Image> Component is an extension of the HTML <img> tag, and comes with automatic image optimization, such as:

    Preventing layout shift automatically when images are loading.
    Resizing images to avoid shipping large images to devices with a smaller viewport.
    Lazy loading images by default (images load as they enter the viewport).
    Serving images in modern formats, like WebP and AVIF , when the browser supports it.

#### Adding the hero image

Let's use the <Image> component. If you look inside the /public folder, you'll see there are two images: hero-desktop.png and hero-mobile.png. These two images are completely different, and they'll be shown depending if the user's device is a desktop or mobile.

In your /app/page.tsx file, import the component from next/image. Then, add the image 

Here, you're setting the width to 1000 and height to 760 pixels. It's good practice to set the width and height of your images to avoid layout shift, these should be an aspect ratio identical to the source image. These values are not the size the image is rendered, but instead the size of the actual image file used to understand the aspect ratio.

You'll also notice the class hidden to remove the image from the DOM on mobile screens, and md:block to show the image on desktop screens.

#### Test your knowledge and see what you’ve just learned.

True or False: Images without dimensions and web fonts are common causes of layout shift.
A

True
Correct

Images without dimensions and web fonts are common causes of layout shift due to the browser having to download additional resources.
Recommended reading

There's a lot more to learn about these topics, including optimizing remote images and using local font files. If you'd like to dive deeper into fonts and images, see:

        [Image Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
        [Font Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
        [Improving Web Performance with Images (MDN)](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
        [Web Fonts (MDN)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts)
        [How Core Web Vitals Affect SEO](https://vercel.com/blog/how-core-web-vitals-affect-seo)
        [How Google handles JavaScript throughout the indexing process](https://vercel.com/blog/how-google-handles-javascript-throughout-the-indexing-process)


### Creating Layouts and Pages

This section covers: 

        Creating pages and layouts in Next.js.
        Navigating between pages.
        Setting up your database.
        Fetching and streaming data.
        Adding search and pagination.
        Mutating data.
        Handling errors.
        Improving accessibility.
        Adding authentication.
        Adding metadata.    


#### Nested routing

Next.js uses file-system routing where folders are used to create nested routes.
Each folder represents a route segment that maps to a URL path. 

'app' folder is the Root Segment, If you create a nested folder called dashboard inside of app, the folder will be mapped to /dashboard.

And you can create separate UIs for each route using layout.tsx and page.tsx files.

'app/page.tsx' is a special Next.js file that exports a React component, and it's required for the route to be accessible.
it's the home page and it's 'segment' is associated with the route '/'.

to create a nested route, inside nest folders as accissible route, add page.tsx inside that 'segment folder'.


#### Creating page

Once the route folder is created, create a new page.tsx file inside it to export the page, for instance: 

        export default function Page() {
                return <p>Dashboard Page</p>;
        }

This is how you can create different pages in Next.js: create a new route segment using a folder, and add a page file inside it.

#### [colocation](https://nextjs.org/docs/app/getting-started/project-structure#colocation)

In the app directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path.

However, even though route structure is defined through folders, a route is not publicly accessible until a page.js or route.js file is added to a route segment.

And, even when a route is made publicly accessible, only the content returned by page.js or route.js is sent to the client.

This means that project files can be safely colocated inside route segments in the app directory without accidentally being routable.

"
By having a special name for page files, Next.js allows you to colocate UI components, test files, and other related code with your routes. Only the content inside the page file will be publicly accessible. For example, the /ui and /lib folders are colocated inside the /app folder along with your routes.
"

Good to know: While you can colocate your project files in app you don't have to. 
If you prefer, you can [keep them outside the app directory](https://nextjs.org/docs/app/getting-started/project-structure#store-project-files-outside-of-app).



#### Creating the layout

let's say, Dashboards have some sort of navigation that is shared across multiple pages. In Next.js, you can use a special layout.tsx file in a segment folder to create UI that is shared between multiple pages. Let's create a layout for the dashboard pages!

now inside /dashboard folder, add a layout.tsx file with the following content:

```tsx
import SideNav from '@/app/ui/dashboard/sidenav';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
```


One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. This is called [partial rendering](https://nextjs.org/docs/app/getting-started/linking-and-navigating#4-partial-rendering) which preserves client-side React state in the layout when transitioning between pages.


#### Root layout

The root layout is defined in the top-level layout.tsx file located in the app directory. 
This [root layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout#root-layouts) is required in every Next.js application.

Any UI you add to the root layout will be shared across all pages in the application.
This layout is a Server Component by default and can be used to modify the initial HTML returned from the server, e.g:
You can use the root layout to modify your <html> and <body> tags, and add [metadata](https://nextjs.org/learn/dashboard-app/adding-metadata).

We have imported the Inter font into this root layout: /app/layout.tsx.

#### Navigating Between Pages
Learn more about [how navigation works](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#how-routing-and-navigation-works).

Since we have dashboard layout and pages in place, let's add some links for users to navigate bwtween dashboard routes (pages).

This is to cover the following concepts:

        How to use the next/link component.

        How to show an active link with the usePathname() hook.

        How navigation works in Next.js.


##### why optimize navigation?

To link between pages, you'd traditionally use the <a> HTML element. At the moment, the sidebar links use <a> elements, but notice what happens when you navigate between the home, invoices, and customers pages on your browser.


here we go the <Link> component.

##### The <Link> component

In Next.js, you can use the <Link /> Component to link between pages in your application. <Link> allows you to do client-side navigation with JavaScript.

To use the <Link /> component, open /app/ui/dashboard/nav-links.tsx, and import the Link component from next/link. Then, replace the <a> tag with <Link>.


Now in dashboard/layout.tsx, replace SideNav by NavLinks

##### Automatic code-splitting and prefetching

To improve the navigation experience, Next.js automatically code splits your application by route segments. This is different from a traditional React SPA, where the browser loads all your application code on the initial page load.

Splitting code by routes means that pages become isolated. If a certain page throws an error, the rest of the application will still work. This is also less code for the browser to parse, which makes your application faster.

Furthermore, in production, whenever <Link> components appear in the browser's viewport, Next.js automatically prefetches the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!

##### Pattern: Showing active links

A common UI pattern is to show an active link to indicate to the user what page they are currently on. To do this, you need to get the user's current path from the URL. Next.js provides a hook called usePathname() that you can use to check the path and implement this pattern.


Since usePathname()
is a React hook, you'll need to turn nav-links.tsx into a Client Component. Add React's "use client" directive to the top of the file, then import usePathname() from next/navigation

You can use the clsx library introduced in the chapter on CSS styling to conditionally apply class names when the link is active. When link.href matches the pathname, the link should be displayed with blue text and a light blue background.

### Work on BE stuff with Vercel

#### Get github repo ready

#### deploy it to Vercel

login as github user: cdeyyt

https://vercel.com/yongs-projects-2561a9d3/dashboard


#### Setting up your database 

option: from one of from one of [Vercel's marketplace integrations](https://vercel.com/marketplace?category=storage)

In your Vercel project, select the 'Storage' tab to create database.

Select Supabase to create a postgresql database.
https://vercel.com/yongs-projects-2561a9d3/dashboard/stores/integration/supabase/store_bxT6GCyX9tuYvTAR/guides
https://supabase.com/dashboard/project/nxyktwufqaibnrmxjhhb#

Once the database is created, choose 'connect project', so that the access settings are configured for the project as environment variables: e.g.
https://vercel.com/yongs-projects-2561a9d3/dashboard/settings/environment-variables

Redeploy the app. then Now you can seed the data by visit route /seed


For local development, go to the supabase databaes project, once connected, navigate to .env.local tab, click Show secret and Copy Snippet, and save it to .env file. 
Make sure your .gitignore file has .env ignored

Now that the database has been connected, let's seed it with some initial data.
run 'pnpm run dev' and navigate to localhost:3000/seed

To query the database, try the route /query.

#### alternative to vercel's integration solution

##### Use database in docker
##### consider Firebase studio, google's app development platform
https://studio.firebase.google.com/dashboard-96503663


### Add Testing Support

#### Add Tdd test framework for this nextjs project

For your Next.js project, I'd recommend Jest with React Testing Library     
as the best TDD framework combination. Here's why:

 1 Jest is the most popular and well-supported testing framework for        
   Next.js/React applications. It comes with:
    • Built-in test runner and assertion library
    • Snapshot testing
    • Mocking capabilities
    • Great TypeScript support
    • Fast watch mode
 2 React Testing Library complements Jest perfectly for:
    • Testing components in a way that resembles how users interact with    
      them
    • Encouraging good testing practices (testing behavior over
      implementation)
    • Works well with both client and server components in Next.js
 3 Next.js has built-in support for this setup - it's what the Vercel team  
   recommends and uses internally.

To set this up, you'll want to:

 1 Install the dependencies:


pnpm add -D jest @testing-library/react @testing-library/jest-dom
@testing-library/user-event jest-environment-jsdom @types/jest


 2 Create a jest.config.js file:


module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],  
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],  
  },
}


 3 Create a jest.setup.js file:


import '@testing-library/jest-dom/extend-expect'


For testing API routes (like your query and seed routes), you might also    
want to add:


pnpm add -D node-mocks-http


Alternative options to consider:

 • Vitest - Faster than Jest and gaining popularity, but slightly less      
   mature ecosystem for Next.js
 • Cypress - For end-to-end testing (great complement to Jest/RTL)

Would you like me to provide specific test examples for any part of your    
application to help you get started with TDD?

### Fetching Data

Let's discuss the different ways you can fetch data from your database, including using APIs, SQL, and alternatives.


the topics covered here:

        Learn about some approaches to fetching data: APIs, ORMs, SQL, etc.
        
        How Server Components can help you access back-end resources more securely.
        
        What network waterfalls are.
        
        How to implement parallel data fetching using a JavaScript Pattern.


#### Choosing how to fetch data

API layer

APIs are an intermediary layer between your application code and database. There are a few cases where you might use an API:

    If you're using third-party services that provide an API.
    If you're fetching data from the client, you want to have an API layer that runs on the server to avoid exposing your database secrets to the client.

In Next.js, you can create API endpoints using Route Handlers.


Database queries

When you're creating a full-stack application, you'll also need to write logic to interact with your database. For relational databases
like Postgres, you can do this with SQL or with an ORM

.

There are a few cases where you have to write database queries:

    When creating your API endpoints, you need to write logic to interact with your database.
    If you are using React Server Components (fetching data on the server), you can skip the API layer, and query your database directly without risking exposing your database secrets to the client.


##### Using Server components to fetch data

By default, Next.js applications use React Server Components. Fetching data with Server Components is a relatively new approach and there are a few benefits of using them:

    Server Components support JavaScript Promises, providing a solution for asynchronous tasks like data fetching natively. You can use async/await syntax without needing useEffect, useState or other data fetching libraries.
    Server Components run on the server, so you can keep expensive data fetches and logic on the server, only sending the result to the client.
    Since Server Components run on the server, you can query the database directly without an additional API layer. This saves you from writing and maintaining additional code.


Using SQL

For your dashboard application, you'll write database queries using the postgres.js

library and SQL. There are a few reasons why we'll be using SQL:

    SQL is the industry standard for querying relational databases (e.g. ORMs generate SQL under the hood).
    Having a basic understanding of SQL can help you understand the fundamentals of relational databases, allowing you to apply your knowledge to other tools.
    SQL is versatile, allowing you to fetch and manipulate specific data.
    The postgres.js library provides protection against SQL injections

Fetching data for <RevenueChart/>
Fetching data for <LatestInvoices/>
Fetching data for the <Card> components

However... there are two things you need to be aware of:

    The data requests are unintentionally blocking each other, creating a request waterfall.
    By default, Next.js prerenders routes to improve performance, this is called Static Rendering. So if your data changes, it won't be reflected in your dashboard.

Let's discuss number 1 in this chapter, then look into detail at number 2 

##### What are request waterfalls?

A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests. In the case of data fetching, each request can only begin once the previous request has returned data.

##### Parallel data fetching

A common way to avoid waterfalls is to initiate all data requests at the same time - in parallel.

In JavaScript, you can use the Promise.all()
or Promise.allSettled()
functions to initiate all promises at the same time. For example, in data.ts, we're using Promise.all() in the fetchCardData() function:

```typescript
export async function fetchCardData() {
  try {
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;
 
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);
    // ...
  }
}
```

By using this pattern, we can:


    Start executing all data fetches at the same time, which is faster than waiting for each request to complete in a waterfall.

    Use a native JavaScript pattern that can be applied to any library or framework.

However, there is one disadvantage of relying only on this JavaScript pattern: what happens if one data request is slower than all the others? 


### Static and Dynamic Rendering

In the previous chapter, you fetched data for the Dashboard Overview page. However, we briefly discussed two limitations of the current setup:

    The data requests are creating an unintentional waterfall.
    The dashboard is static, so any data updates will not be reflected on your application.



Here are the topics we’ll cover

  What static rendering is and how it can improve your application's performance.

  What dynamic rendering is and when to use it.

  Different approaches to make your dashboard dynamic.

  Simulate a slow data fetch to see what happens.


#### What is Static Rendering?

With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or when revalidating data.

Whenever a user visits your application, the cached result is served. There are a couple of benefits of static rendering:

    Faster Websites - Prerendered content can be cached and globally distributed when deployed to platforms like Vercel

. This ensures that users around the world can access your website's content more quickly and reliably.
Reduced Server Load - Because the content is cached, your server does not have to dynamically generate content for each user request. This can reduce compute costs.
SEO - Prerendered content is easier for search engine crawlers to index, as the content is already available when the page loads. This can lead to improved search engine rankings.


Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data which is regularly updated.

The opposite of static rendering is dynamic rendering.


#### What is Dynamic Rendering?

With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:

    Real-Time Data - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
    User-Specific Content - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
    Request Time Information - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.


#### Simulating a Slow Data Fetch

The dashboard application we're building is dynamic.

However, there is still one problem mentioned in the previous chapter. What happens if one data request is slower than all the others?

Let's simulate a slow data fetch. In app/lib/data.ts, uncomment the console.log and setTimeout inside fetchRevenue():

Here, you've added an artificial 3-second delay to simulate a slow data fetch. The result is that now your whole page is blocked from showing UI to the visitor while the data is being fetched. Which brings us to a common challenge developers have to solve:

With dynamic rendering, your application is only as fast as your slowest data fetch.

### 9. Streaming
Here are the topics we’ll cover

  What streaming is and when you might use it.

  How to implement streaming with loading.tsx and Suspense.

  What loading skeletons are.

  What Next.js Route Groups are, and when you might use them.

  Where to place React Suspense boundaries in your application.


#### What is streaming?

Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.

By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.

Streaming works well with React's component model, as each component can be considered a chunk.

There are two ways you implement streaming in Next.js:

    At the page level, with the loading.tsx file (which creates <Suspense> for you).
    At the component level, with <Suspense> for more granular control.


#### Streaming UI with Suspense

To improve the user experience when some data requests are slow, you can use React's [Suspense](https://react.dev/reference/react/Suspense) feature. Suspense lets you "stream" parts of your UI to the browser as soon as they're ready, instead of waiting for all data to load before showing anything.

With Suspense, you can wrap slow-loading components in a `<Suspense>` boundary and provide a fallback UI (like a loading spinner or skeleton). This way, the rest of your page can render immediately, and only the slow part will show a loading state until its data is ready.

**Example:**

Suppose you have a dashboard with a revenue chart that loads slowly. You can wrap it like this:
...

#### Streaming a whole page with 'loading.tsx'

In the /app/dashboard folder, create a new file called loading.tsx:

    export default function Loading() {
      return <div>Loading...</div>;
    }

A few things are happening here:

    loading.tsx is a special Next.js file built on top of React Suspense. It allows you to create fallback UI to show as a replacement while page content loads.
    Since <SideNav> is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading.
    The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation).

Congratulations! You've just implemented streaming. But we can do more to improve the user experience. Let's show a loading skeleton instead of the Loading… text.


##### Adding loading skeletons

A loading skeleton is a simplified version of the UI. Many websites use them as a placeholder (or fallback) to indicate to users that the content is loading. Any UI you add in loading.tsx will be embedded as part of the static file, and sent first. Then, the rest of the dynamic content will be streamed from the server to the client.

Inside your loading.tsx file, import a new component called <DashboardSkeleton>:

##### Fixing the loading skeleton bug with route groups

Right now, your loading skeleton will apply to the invoices.

But since loading.tsx is a level higher than /invoices/page.tsx and /customers/page.tsx in the file system, it's also applied to those pages.

We can change this with Route Groups
. Create a new folder called /(overview) inside the dashboard folder. Then, move your loading.tsx and page.tsx files inside the folder:

Now, the loading.tsx file will only apply to your dashboard overview page.

Route groups allow you to organize files into logical groups without affecting the URL path structure. When you create a new folder using parentheses (), the name won't be included in the URL path. So /dashboard/(overview)/page.tsx becomes /dashboard.

Here, you're using a route group to ensure loading.tsx only applies to your dashboard overview page. However, you can also use route groups to separate your application into sections (e.g. (marketing) routes and (shop) routes) or by teams for larger applications.

#### Streaming a component

So far, you're streaming a whole page. But you can also be more granular and stream specific components using React Suspense.

Suspense allows you to defer rendering parts of your application until some condition is met (e.g. data is loaded). You can wrap your dynamic components in Suspense. Then, pass it a fallback component to show while the dynamic component loads.

If you remember the slow data request, fetchRevenue(), this is the request that is slowing down the whole page. Instead of blocking your whole page, you can use Suspense to stream only this component and immediately show the rest of the page's UI.

To do so, you'll need to move the data fetch to the component, let's update the code to see what that'll look like:

Delete all instances of fetchRevenue() and its data from /dashboard/(overview)/page.tsx:

#### practice: Streaming <LatestInvoices>


