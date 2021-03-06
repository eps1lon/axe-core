describe('explicit-label', function() {
	'use strict';

	var fixture = document.getElementById('fixture');
	var fixtureSetup = axe.testUtils.fixtureSetup;
	var queryFixture = axe.testUtils.queryFixture;
	var shadowSupport = axe.testUtils.shadowSupport;

	afterEach(function() {
		fixture.innerHTML = '';
	});

	it('should return false if an empty label is present', function() {
		var vNode = queryFixture(
			'<label for="target"></label><input type="text" id="target">'
		);
		assert.isFalse(
			axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
		);
	});

	it('should return true if a non-empty label is present', function() {
		var vNode = queryFixture(
			'<label for="target">Text</label><input type="text" id="target">'
		);
		assert.isTrue(
			axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
		);
	});

	it('should return true if an invisible non-empty label is present, to defer to hidden-explicit-label', function() {
		var vNode = queryFixture(
			'<label for="target" style="display: none;">Text</label><input type="text" id="target">'
		);
		assert.isTrue(
			axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
		);
	});

	it('should return false if a label is not present', function() {
		var vNode = queryFixture('<input type="text" id="target" />');
		assert.isFalse(
			axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
		);
	});

	it('should work for multiple labels', function() {
		var vNode = queryFixture(
			'<label for="target"></label><label for="target">Text</label><input type="text" id="target">'
		);
		assert.isTrue(
			axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
		);
	});

	(shadowSupport.v1 ? it : xit)(
		'should return true if input and label are in the same shadow root',
		function() {
			var root = document.createElement('div');
			var shadow = root.attachShadow({ mode: 'open' });
			shadow.innerHTML =
				'<label for="target">American band</label><input id="target">';
			fixtureSetup(root);

			var vNode = axe.utils.getNodeFromTree(shadow.querySelector('#target'));
			assert.isTrue(
				axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
			);
		}
	);

	(shadowSupport.v1 ? it : xit)(
		'should return true if label content is slotted',
		function() {
			var root = document.createElement('div');
			root.innerHTML = 'American band';
			var shadow = root.attachShadow({ mode: 'open' });
			shadow.innerHTML =
				'<label for="target"><slot></slot></label><input id="target">';
			fixtureSetup(root);

			var vNode = axe.utils.getNodeFromTree(shadow.querySelector('#target'));
			assert.isTrue(
				axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
			);
		}
	);

	(shadowSupport.v1 ? it : xit)(
		'should return false if input is inside shadow DOM and the label is not',
		function() {
			var root = document.createElement('div');
			root.innerHTML = '<label for="target">American band</label>';
			var shadow = root.attachShadow({ mode: 'open' });
			shadow.innerHTML = '<slot></slot><input id="target">';
			fixtureSetup(root);

			var vNode = axe.utils.getNodeFromTree(shadow.querySelector('#target'));
			assert.isFalse(
				axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
			);
		}
	);

	(shadowSupport.v1 ? it : xit)(
		'should return false if label is inside shadow DOM and the input is not',
		function() {
			var root = document.createElement('div');
			root.innerHTML = '<input id="target">';
			var shadow = root.attachShadow({ mode: 'open' });
			shadow.innerHTML =
				'<label for="target">American band</label><slot></slot>';
			fixtureSetup(root);

			var vNode = axe.utils.getNodeFromTree(root.querySelector('#target'));
			assert.isFalse(
				axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, vNode)
			);
		}
	);

	describe('SerialVirtualNode', function() {
		it('should return undefined', function() {
			var virtualNode = new axe.SerialVirtualNode({
				nodeName: 'input',
				attributes: {
					type: 'text'
				}
			});

			assert.isFalse(
				axe.testUtils.getCheckEvaluate('explicit-label')(null, {}, virtualNode)
			);
		});
	});
});
