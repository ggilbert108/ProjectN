(function (globals) {
    "use strict";

    Bridge.define('ProjectN.Graph.INode');
    
    Bridge.define('ProjectN.Graph.Pin', {
        connected: null,
        config: {
            properties: {
                Owner: null,
                PinType: 0
            }
        },
        constructor: function (owner, pinType) {
            this.setOwner(owner);
            this.setPinType(pinType);
            this.connected = null;
        },
        connect: function (other) {
            if (other.getPinType() === this.getPinType()) {
                throw new Bridge.Exception("An input cannot be connected to an input, and and output cannot be connected to an output");
            }
    
            if (Bridge.getTypeName(other) !== Bridge.getTypeName(this)) {
                throw new Bridge.Exception("Connected pins must be of the same type");
            }
    
            this.connected = other;
            other.connected = this;
        },
        sendOutput: function () {
            if (this.getPinType() === ProjectN.Graph.PinType.oUTPUT) {
                this.send();
            }
        },
        recieveInput: function () {
            if (this.getPinType() === ProjectN.Graph.PinType.iNPUT) {
                this.receive();
            }
        }
    });
    
    Bridge.define('ProjectN.Graph.PinType', {
        statics: {
            iNPUT: 0,
            oUTPUT: 1
        },
        $enum: true
    });
    
    Bridge.define('ProjectN.Graph.Scope', {
        scope: null,
        constructor: function () {
            this.scope = { };
        },
        setValue: function (T, key, value) {
            this.scope[key] = new ProjectN.Graph.ValueWrapper$1(T)(value);
        },
        getValue: function (T, key) {
            var wrapper = Bridge.cast(this.scope[key], ProjectN.Graph.ValueWrapper$1(T));
            return wrapper.value;
        },
        createGetNode: function (key) {
            var wrapper = Bridge.cast(this.scope[key], ProjectN.Graph.ValueWrapper);
            return wrapper.createGetNode(this, key);
        },
        createSetNode: function (key) {
            var wrapper = Bridge.cast(this.scope[key], ProjectN.Graph.ValueWrapper);
            return wrapper.createSetNode(this, key);
        }
    });
    
    Bridge.define('ProjectN.Graph.ValueWrapper');
    
    Bridge.define('ProjectN.Graph.ConditionNode', {
        inherits: [ProjectN.Graph.INode],
        config: {
            properties: {
                ExecutionIn: null,
                ConditionIn: null,
                ExecutionTrueOut: null,
                ExecutionFalseOut: null
            }
        },
        constructor: function () {
            this.setExecutionIn(new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.iNPUT));
            this.setConditionIn(new ProjectN.Graph.DataPin$1(Boolean)(this, ProjectN.Graph.PinType.iNPUT));
    
            this.setExecutionTrueOut(new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.oUTPUT));
            this.setExecutionFalseOut(new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.iNPUT));
        },
        prepareForExecute: function () {
            this.getConditionIn().recieveInput();
        },
        execute: function () {
            if (this.getConditionIn().getData$1()) {
                this.getExecutionTrueOut().sendOutput();
            }
            else  {
                this.getExecutionFalseOut().sendOutput();
            }
        }
    });
    
    Bridge.define('ProjectN.Graph.DataPin$1', function (T) { return {
        inherits: [ProjectN.Graph.Pin],
        config: {
            properties: {
                Data$1: null
            }
        },
        constructor: function (owner, pinType) {
            ProjectN.Graph.Pin.prototype.$constructor.call(this, owner, pinType);
    
    
        },
        send: function () {
            var otherPin = Bridge.as(this.connected, ProjectN.Graph.DataPin$1(T));
            otherPin.setData$1(this.getData$1());
        },
        receive: function () {
            var otherPin = Bridge.as(this.connected, ProjectN.Graph.DataPin$1(T));
            this.setData$1(otherPin.getData$1());
        },
        setData: function (data) {
            this.setData$1(data);
        }
    }; });
    
    Bridge.define('ProjectN.Graph.ExecutionPin', {
        inherits: [ProjectN.Graph.Pin],
        constructor: function (owner, pinType) {
            ProjectN.Graph.Pin.prototype.$constructor.call(this, owner, pinType);
    
    
        },
        send: function () {
            this.connected.getOwner().prepareForExecute();
            this.connected.getOwner().execute();
        },
        receive: function () {
            throw new Bridge.NotImplementedException();
        }
    });
    
    Bridge.define('ProjectN.Graph.ForNode', {
        inherits: [ProjectN.Graph.INode],
        executionIn: null,
        startIndexIn: null,
        endIndexIn: null,
        hiddenIn: null,
        loopBodyOut: null,
        loopFinishedOut: null,
        hiddenOut: null,
        index: 0,
        maxIndex: 0,
        constructor: function (startIndex, maxIndex) {
            if (startIndex === void 0) { startIndex = -1; }
            if (maxIndex === void 0) { maxIndex = -1; }
            this.executionIn = new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.iNPUT);
            this.startIndexIn = new ProjectN.Graph.DataPin$1(Bridge.Int)(this, ProjectN.Graph.PinType.iNPUT);
            this.endIndexIn = new ProjectN.Graph.DataPin$1(Bridge.Int)(this, ProjectN.Graph.PinType.iNPUT);
            this.hiddenIn = new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.iNPUT);
    
            this.loopBodyOut = new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.oUTPUT);
            this.loopFinishedOut = new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.oUTPUT);
            this.hiddenOut = new ProjectN.Graph.ExecutionPin(this, ProjectN.Graph.PinType.oUTPUT);
    
            this.hiddenOut.connect(this.hiddenIn);
    
            this.index = startIndex;
            maxIndex = this.index;
        },
        prepareForExecute: function () {
            if (this.index === this.maxIndex && this.index === -1) {
                this.startIndexIn.recieveInput();
                this.endIndexIn.recieveInput();
    
                this.index = this.startIndexIn.getData$1();
                this.maxIndex = this.endIndexIn.getData$1();
            }
        },
        execute: function () {
            if (this.index === this.maxIndex) {
                this.loopFinishedOut.sendOutput();
                return;
            }
    
            this.index++;
            this.loopBodyOut.sendOutput();
            this.hiddenOut.sendOutput();
        }
    });
    
    Bridge.define('ProjectN.Graph.GetNode', {
        inherits: [ProjectN.Graph.INode]
    });
    
    Bridge.define('ProjectN.Graph.SetNode', {
        inherits: [ProjectN.Graph.INode]
    });
    
    Bridge.define('ProjectN.Graph.ValueWrapper$1', function (T) { return {
        inherits: [ProjectN.Graph.ValueWrapper],
        value: null,
        constructor: function (value) {
            ProjectN.Graph.ValueWrapper.prototype.$constructor.call(this);
    
            this.value = value;
        },
        createGetNode: function (scope, key) {
            return new ProjectN.Graph.GetNode$1(T)(scope, key);
        },
        createSetNode: function (scope, key) {
            return new ProjectN.Graph.SetNode$1(T)(scope, key);
        }
    }; });
    
    Bridge.define('ProjectN.Graph.GetNode$1', function (T) { return {
        inherits: [ProjectN.Graph.GetNode],
        dataOut: null,
        scope: null,
        key: null,
        constructor: function (scope, key) {
            ProjectN.Graph.GetNode.prototype.$constructor.call(this);
    
            this.dataOut = new ProjectN.Graph.DataPin$1(T)(this, ProjectN.Graph.PinType.oUTPUT);
            this.scope = scope;
            this.key = key;
        },
        prepareForExecute: function () {
            this.dataOut.setData(this.scope.getValue(T, this.key));
        },
        execute: function () {
            this.dataOut.sendOutput();
        }
    }; });
    
    Bridge.define('ProjectN.Graph.SetNode$1', function (T) { return {
        inherits: [ProjectN.Graph.SetNode],
        dataIn: null,
        scope: null,
        key: null,
        constructor: function (scope, key) {
            ProjectN.Graph.SetNode.prototype.$constructor.call(this);
    
            this.dataIn = new ProjectN.Graph.DataPin$1(T)(this, ProjectN.Graph.PinType.oUTPUT);
            this.scope = scope;
            this.key = key;
        },
        prepareForExecute: function () {
        },
        execute: function () {
            this.scope.setValue(T, this.key, this.dataIn.getData$1());
        }
    }; });
    
    Bridge.init();
})(this);
