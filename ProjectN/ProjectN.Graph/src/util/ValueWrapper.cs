namespace ProjectN.Graph
{
    public abstract class ValueWrapper
    {
        public abstract GetNode CreateGetNode(Scope scope, string key);

        public abstract SetNode CreateSetNode(Scope scope, string key);
    }

    public class ValueWrapper<T> : ValueWrapper
    {
        public T Value;

        public ValueWrapper(T value)
        {
            Value = value;
        }

        public override GetNode CreateGetNode(Scope scope, string key)
        {
            return new GetNode<T>(scope, key);
        }

        public override SetNode CreateSetNode(Scope scope, string key)
        {
            return new SetNode<T>(scope, key);
        }
    }
}