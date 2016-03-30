namespace ProjectN.Graph
{
    public abstract class SetNode : INode
    {
        public abstract void PrepareForExecute();

        public abstract void Execute();
    }

    public class SetNode<T> : SetNode
    {
        protected DataPin<T> DataIn;
        protected Scope Scope;
        protected string Key;

        public SetNode(Scope scope, string key)
        {
            DataIn = new DataPin<T>(this, PinType.OUTPUT);
            Scope = scope;
            Key = key;
        }

        public override void PrepareForExecute()
        {
        }

        public override void Execute()
        {
            Scope.SetValue(Key, DataIn.Data);
        }
    }
}