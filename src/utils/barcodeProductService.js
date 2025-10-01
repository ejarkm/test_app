// Mock service to simulate product data retrieval from barcode/QR codes
// In a real implementation, this would call an external API like OpenFoodFacts, UPC Database, etc.

const mockProductDatabase = {
  // EAN-13 codes for common products
  '8410000000000': {
    name: 'Tomates Cherry Premium',
    category: 'vegetables',
    description: 'Tomates cherry frescos de invernadero',
    unit: 'kg',
    unitCost: 4.50,
    minStock: 15,
    maxStock: 50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    supplier: 'supplier2' // Frutas y Verduras López
  },
  '7622300000000': {
    name: 'Aceite de Oliva Virgen Extra',
    category: 'grains', // Using existing category
    description: 'Aceite de oliva virgen extra de primera presión en frío',
    unit: 'l',
    unitCost: 12.90,
    minStock: 8,
    maxStock: 25,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    supplier: 'supplier1' // Distribuidora Central
  },
  '8000000000000': {
    name: 'Pechuga de Pollo Fresca',
    category: 'meat',
    description: 'Pechuga de pollo fresca sin piel, ideal para plancha',
    unit: 'kg',
    unitCost: 8.95,
    minStock: 10,
    maxStock: 30,
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    supplier: 'supplier3' // Carnicería Premium
  },
  '3017000000000': {
    name: 'Leche Entera UHT',
    category: 'dairy',
    description: 'Leche entera UHT larga vida, rica en calcio',
    unit: 'l',
    unitCost: 1.45,
    minStock: 20,
    maxStock: 60,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    supplier: 'supplier4' // Lácteos Frescos SA
  },
  '8714100000000': {
    name: 'Arroz Bomba Denominación de Origen',
    category: 'grains',
    description: 'Arroz bomba D.O. Valencia, perfecto para paellas',
    unit: 'kg',
    unitCost: 5.80,
    minStock: 15,
    maxStock: 40,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    supplier: 'supplier1' // Distribuidora Central
  },
  '8901000000000': {
    name: 'Salmón Fresco Atlántico',
    category: 'meat', // Using existing category for seafood
    description: 'Salmón fresco del Atlántico, fileteado sin espinas',
    unit: 'kg',
    unitCost: 16.50,
    minStock: 5,
    maxStock: 15,
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    supplier: 'supplier3' // Using existing supplier
  },
  // QR codes (can contain more complex data)
  'PRODUCT_BEEF_001': {
    name: 'Ternera Premium Madurada',
    category: 'meat',
    description: 'Ternera premium madurada 21 días, corte especial',
    unit: 'kg',
    unitCost: 24.90,
    minStock: 8,
    maxStock: 20,
    image: 'https://images.unsplash.com/photo-1588347818195-c127dd8e4081?w=400',
    supplier: 'supplier3'
  },
  'PRODUCT_WINE_001': {
    name: 'Vino Tinto Reserva',
    category: 'beverages',
    description: 'Vino tinto reserva D.O. Rioja, cosecha 2019',
    unit: 'bottle',
    unitCost: 18.50,
    minStock: 12,
    maxStock: 36,
    image: 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400',
    supplier: 'supplier5' // Bebidas Martínez
  }
};

/**
 * Simulates fetching product data from a barcode or QR code
 * @param {string} code - The scanned barcode or QR code
 * @returns {Promise<Object|null>} Product data or null if not found
 */
export const getProductByCode = async (code) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Clean the code (remove any extra characters)
  const cleanCode = code?.trim();
  
  // Check if product exists in our mock database
  const productData = mockProductDatabase[cleanCode];
  
  if (productData) {
    // Generate a unique SKU
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    const sku = `PRD-${randomStr}-${timestamp}`;
    
    // Calculate expiry date (different for different categories)
    const now = new Date();
    let expiryDate;
    
    switch (productData.category) {
      case 'meat':
        // Fresh meat expires in 3 days
        expiryDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
        break;
      case 'dairy':
        // Dairy products expire in 7 days
        expiryDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        break;
      case 'vegetables':
      case 'fruits':
        // Fresh produce expires in 5 days
        expiryDate = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));
        break;
      case 'beverages':
        // Beverages last longer
        expiryDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
        break;
      default:
        // Default: 30 days
        expiryDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    }
    
    return {
      ...productData,
      sku,
      barcode: cleanCode,
      expiryDate: expiryDate.toISOString().split('T')[0], // YYYY-MM-DD format
      quantity: 10 // Default initial quantity
    };
  }
  
  return null;
};

/**
 * Gets a list of sample barcodes for testing
 * @returns {Array} Array of sample barcode data
 */
export const getSampleBarcodes = () => {
  return Object.keys(mockProductDatabase).map(code => ({
    code,
    name: mockProductDatabase[code].name,
    type: code.length > 10 ? 'Código de Barras' : 'Código QR'
  }));
};

/**
 * Validates if a code looks like a valid barcode or QR code
 * @param {string} code - The code to validate
 * @returns {Object} Validation result with type and isValid
 */
export const validateScannedCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { isValid: false, type: 'unknown', error: 'Código inválido' };
  }
  
  const cleanCode = code.trim();
  
  // Check for EAN-13 (13 digits)
  if (/^\d{13}$/.test(cleanCode)) {
    return { isValid: true, type: 'EAN-13', code: cleanCode };
  }
  
  // Check for EAN-8 (8 digits)
  if (/^\d{8}$/.test(cleanCode)) {
    return { isValid: true, type: 'EAN-8', code: cleanCode };
  }
  
  // Check for UPC-A (12 digits)
  if (/^\d{12}$/.test(cleanCode)) {
    return { isValid: true, type: 'UPC-A', code: cleanCode };
  }
  
  // Check for QR code (alphanumeric, can be more complex)
  if (/^[A-Z0-9_-]+$/i.test(cleanCode) && cleanCode.length >= 3) {
    return { isValid: true, type: 'QR Code', code: cleanCode };
  }
  
  return { isValid: false, type: 'unknown', error: 'Formato de código no reconocido' };
};
