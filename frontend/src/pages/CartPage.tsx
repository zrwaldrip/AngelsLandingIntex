import { useNavigate } from 'react-router-dom';
import CartSummary from '../components/CartSummary';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item: CartItem) => {
    return total + item.quantity * item.price;
  }, 0);

  return (
    <div>
      <CartSummary />
      <h2>Your Angels' Landing support selections</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {cart.map((item: CartItem) => (
              <li key={item.entryId} className="list-group-item">
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    navigate(
                      `/product/${item.entryName}/${item.entryId}/${item.price}`
                    )
                  }
                >
                  {item.entryName}
                </span>{' '}
                : {item.quantity} x ${item.price.toFixed(2)}
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeFromCart(item.entryId)}
                >
                  &nbsp;🗑️
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
      <button>Proceed to Donation Checkout</button>
      <button onClick={() => navigate('/catalog')}>Continue Exploring</button>
    </div>
  );
}

export default CartPage;
