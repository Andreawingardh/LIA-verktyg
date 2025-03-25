
export default function Header({ metadata }) {
    return (
      <header>
        { metadata.title } by { metadata.organization }
      </header>
    );
  }