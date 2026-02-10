import classes from './footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={classes.footer}>
      <p>&copy; {year} </p>
    </footer>
  );
}
export default Footer;
