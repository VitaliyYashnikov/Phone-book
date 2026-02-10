import classes from './notfound.module.css';

function NotFound() {
    return (
        <section className={classes.notFound}>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
        </section>
    );
}

export default NotFound;
