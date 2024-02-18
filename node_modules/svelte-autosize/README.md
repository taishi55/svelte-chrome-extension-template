# svelte-autosize

Svelte action to automatically adjust textarea height to match its contents.

Simply wraps [autosize by Jack Moore](https://github.com/jackmoore/autosize) in a Svelte action.

## Install via NPM

```
npm install svelte-autosize
```

## Usage

```html
<script>
import autosize from 'svelte-autosize';
</script>

<textarea use:autosize></textarea>
```

## License

[MIT](https://opensource.org/licenses/mit-license.php)
