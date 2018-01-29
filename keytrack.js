var KeyTrack = {};
KeyTrack.value = [];
KeyTrack.keyDownCallBack = function (event) {
    if (event.timeStamp) {
        KeyTrack.current = parseInt((event.timeStamp - KeyTrack.previusTime), 10);
    }

    var keyCode;

    if (event.key.length === 1) {
        // When it's a char (not meta)
        keyCode = event.key.charCodeAt(0);
    } else {
        // when it's a meta
        keyCode = event.key;
    }

    console.log(event)

    if (event.key) {
        KeyTrack.value.push(
            [
                KeyTrack.current,
                keyCode
            ]
        );

        // if it's the first char
        if (KeyTrack.value.length === 1) {
            KeyTrack.value[0][0] = 0;
        }
    }

    KeyTrack.previusTime = event.timeStamp;
};

KeyTrack.listen = function () {
    document.addEventListener('keydown', KeyTrack.keyDownCallBack);
};

KeyTrack.track = function () {
    KeyTrack.previusTime = Date.now();
    KeyTrack.listen();
};

KeyTrack.get = function () {
    var result = '';
    for (var i = 0; i < KeyTrack.value.length; i++) {
        result += KeyTrack.value[i][0] + '-' + KeyTrack.value[i][1] + '|';
    }

    // remove last char (|)
    result = result.slice(0, -1);
    result = window.btoa(result);
    return result;
};

KeyTrack.play = function (keyTrackValue, elementId) {
    var result = window.atob(keyTrackValue);
    result = result.split('|');
    var parentElement = document.getElementById(elementId);
    var ulElement = document.createElement('ul');
    parentElement.appendChild(ulElement);

    var liElement = [];
    liElement[0] = document.createElement('li');
    ulElement.appendChild(liElement[0]);
    var _timeOutCounter = 0;
    var _currentChar = '';
    var _cursorPosition = 0;
    var _index = false;
    var _currentLine = 0;
    var _homeKey = false;
    (function _simulate() {
        window.setTimeout(function () {
            var _currentText = liElement[_currentLine].innerHTML;
            if (result[_timeOutCounter]) {
                _currentChar = result[_timeOutCounter].split('-');
                if (_currentChar) {
                    // It's only a number when it's a unicode
                    if (!isNaN(_currentChar[1]) || _currentChar[1] === 'Space') {
                        if (!isNaN(_currentChar[1])) {
                            _currentChar[1] = String.fromCharCode(_currentChar[1]); // get string
                        } else if (_currentChar[1] === 'Space') {
                            _currentChar[1] = ' ';
                        }


                        if (_cursorPosition === 0 && _homeKey === false) {
                            _index = _currentText.length;
                        }

                        _currentText = _currentText.slice(0, _index) +
                            _currentChar[1] +
                            _currentText.slice(_index, _currentText.length);

                        if (_cursorPosition !== 0 || _homeKey === true) {
                            _index++;
                        }

                        liElement[_currentLine].innerHTML = _currentText;

                    } else {
                        // When it's not a char (it's a meta or controller key, such as escape, ctrl, shift and alt)

                        // When the previous key is not enter
                        if (result[_timeOutCounter - 1] !== 'Enter') {
                            if (_currentChar[1] === 'Backspace') {
                                if (_index + 1 === _currentText.length) {
                                    _currentText = _currentText.slice(0, -1);
                                } else {
                                    _currentText =
                                        _currentText.slice(0, _index - 1) +
                                        _currentText.slice(_index, _currentText.length);
                                    _index--;
                                }
                                liElement[_currentLine].innerHTML = _currentText;
                            }

                            if (_currentChar[1] === 'ArrowLeft') {
                                _homeKey = false;
                                _cursorPosition--;
                                _index = (_currentText.length + (_cursorPosition));
                                if (_index <= 0) {
                                    _index = 0;
                                }

                            } else if (_currentChar[1] === 'ArrowRight') {
                                _homeKey = false;
                                _cursorPosition++;
                                _index++;
                                if (_index > liElement[_currentLine].innerHTML) {
                                    _index = liElement[_currentLine].innerHTML;
                                }
                            }
                        }

                        if (_currentChar[1] === 'Enter') {
                            _currentLine++;
                            _homeKey = false;
                            _index = 0;
                            _cursorPosition = 0;
                            liElement[_currentLine] = document.createElement('li');
                            ulElement.appendChild(liElement[_currentLine]);
                        }

                        if (_currentChar[1] === 'End') {
                            _cursorPosition = _currentText.length;
                            _index = _currentText.length;
                            _homeKey = false;
                        }

                        if (_currentChar[1] === 'Home') {
                            _homeKey = true;
                            _index = 0;
                        }
                    }

                }
                _timeOutCounter++;
                _simulate()
            }
        }, _currentChar[0])
    }());

    return result;
};
