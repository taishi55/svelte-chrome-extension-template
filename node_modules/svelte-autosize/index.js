import autosize from 'autosize';

const action = (node) => {
	autosize(node);

	return {
		destroy() {
			autosize.destroy(node);
		},
	};
};

action.update = autosize.update;
action.destroy = autosize.destroy;

export default action;
