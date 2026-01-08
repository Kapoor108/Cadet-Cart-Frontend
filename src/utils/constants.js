export const GROUPS = ['Army', 'Navy', 'Air Force'];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

export const ORDER_STATUS = {
  pending_payment: { label: 'Pending Payment', color: 'badge-pending' },
  payment_verified: { label: 'Payment Verified', color: 'badge-info' },
  processing: { label: 'Processing', color: 'badge-info' },
  ready_for_delivery: { label: 'Ready for Delivery', color: 'badge-info' },
  out_for_delivery: { label: 'Out for Delivery', color: 'badge-info' },
  delivered: { label: 'Delivered', color: 'badge-success' },
  cancelled: { label: 'Cancelled', color: 'badge-error' }
};

export const PAYMENT_STATUS = {
  pending: { label: 'Pending', color: 'badge-pending' },
  processing: { label: 'Processing', color: 'badge-info' },
  completed: { label: 'Completed', color: 'badge-success' },
  failed: { label: 'Failed', color: 'badge-error' }
};

export const UNIFORM_ITEMS = [
  { key: 'beret', name: 'Beret', price: 250, hasSizes: true },
  { key: 'eagles', name: 'Eagles', price: 150, hasType: true, types: ['silver', 'golden'] },
  { key: 'nccTitleShoulder', name: 'NCC Title Shoulder', price: 50, hasQuantity: true },
  { key: 'belt', name: 'Belt', price: 300, hasQuantity: true },
  { key: 'dms', name: 'DMS Shoes', price: 1500, hasShoeSizes: true },
  { key: 'hanger', name: 'Hanger', price: 30, hasQuantity: true },
  { key: 'jersey', name: 'Jersey', price: 800, hasSizes: true },
  { key: 'nccTracksuit', name: 'NCC Tracksuit', price: 1200, hasSizes: true },
  { key: 'rank', name: 'Rank', price: 100, hasType: true },
  { key: 'nccTshirt', name: 'NCC T-Shirt', price: 400, hasSizes: true },
  { key: 'hackel', name: 'Hackel', price: 80, hasQuantity: true },
  { key: 'lineyard', name: 'Lineyard', price: 60, hasQuantity: true },
  { key: 'pCap', name: 'P-Cap', price: 150, hasQuantity: true },
  { key: 'blackSocks', name: 'Black Socks', price: 50, hasPairs: true },
  { key: 'shoePolishBrush', name: 'Shoe Polish Brush', price: 100, hasQuantity: true },
  { key: 'toiletries', name: 'Toiletries Kit', price: 200 },
  { key: 'cutlery', name: 'Cutlery Set', price: 150 }
];

export const FOOD_ITEMS = [
  { key: 'noodle', name: 'Noodles', halfPrice: 40, fullPrice: 70, types: ['Veg', 'Corn', 'Hakka'] },
  { key: 'manchurian', name: 'Manchurian', halfPrice: 50, fullPrice: 90, styles: ['Gravy', 'Dry'] },
  { key: 'momos', name: 'Momos', halfPrice: 40, fullPrice: 70, types: ['Soya', 'Kurkure', 'Fried'] },
  { key: 'springRoll', name: 'Spring Roll', halfPrice: 35, fullPrice: 60 },
  { key: 'burger', name: 'Burger', price: 80 }
];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
