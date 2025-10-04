import { Link } from "react-router-dom";
import PublicFooter from "../components/layout/PublicFooter";
import "../styles/pages/LandingPage.css";

export default function LandingPage() {
  return (
    <>
      <main className="landing">
        <section className="hero">
          <img
            src="/brand-logo3.png"
            alt="REGALBANK - Logotipo"
            className="hero__logo"
            loading="eager"
            decoding="sync"
          />
          <p className="hero__lead">
            Gestiona tus cuentas y operaciones con una interfaz clara, rápida y segura.
          </p>
        </section>

        <section className="cards-stack" aria-label="Tarjetas">
          <div className="stack">
            <img
              className="card-img card-img--a"
              src="/tarjeta-1.png"
              alt="Tarjeta REGALBANK 1"
              loading="lazy"
            />
            <img
              className="card-img card-img--b"
              src="/tarjeta-2.png"
              alt="Tarjeta REGALBANK 2"
              loading="lazy"
            />
          </div>
        </section>

        {/* CTA final*/}
        <section className="cta-bottom" aria-label="Acciones">
          <div className="cta-bottom__group">
            <Link to="/register"><button className="btn btn--primary">Crear cuenta</button></Link>
            <Link to="/login"><button className="btn">Iniciar sesión</button></Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}