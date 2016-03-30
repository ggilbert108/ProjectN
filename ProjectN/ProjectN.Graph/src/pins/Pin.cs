using System;
using Bridge.Html5;

namespace ProjectN.Graph
{
    public abstract class Pin
    {
        public INode Owner { get; private set; }
        public PinType PinType { get; private set; }

        protected Pin Connected;

        protected Pin(INode owner, PinType pinType)
        {
            Owner = owner;
            PinType = pinType;
            Connected = null;
        }

        public void Connect(Pin other)
        {
            if (other.PinType == PinType)
            {
                throw new Exception("An input cannot be connected to an input," +
                                    " and and output cannot be connected to an output");
            }

            if (other.GetClassName() != GetClassName())
            {
                throw new Exception("Connected pins must be of the same type");
            }

            Connected = other;
            other.Connected = this;
        }

        public void SendOutput()
        {
            if (PinType == PinType.OUTPUT)
            {
                Send();
            }
        }

        public void RecieveInput()
        {
            if (PinType == PinType.INPUT)
            {
                Receive();
            }
        }

        protected abstract void Send();

        protected abstract void Receive();
    }

    public enum PinType
    {
        INPUT, OUTPUT
    }
}