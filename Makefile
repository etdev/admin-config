install:
	@npm install
	./node_modules/protractor/bin/webdriver-manager update

test:
	@./node_modules/mocha/bin/mocha --compilers js:babel/register --recursive tests/
