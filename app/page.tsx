import Hero from "./components/Hero";
import PopularEvents from "./components/PopularEvents";

/**
 * @brief  Renders the welcome route with temporary logged-in detection.
 * @return The JSX structure of the welcome route.
 */
export default function Page() {
  return (
    <main className="eventloop-main-page">
      <section className="eventloop-welcome-page-content">
        <Hero />
        <PopularEvents />
      </section>
    </main>
  );
}
