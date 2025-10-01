import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProductCatalog = ({ onAddToOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState('appetizers');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'appetizers', name: 'Aperitivos', icon: 'Utensils' },
    { id: 'mains', name: 'Platos Principales', icon: 'ChefHat' },
    { id: 'beverages', name: 'Bebidas', icon: 'Coffee' },
    { id: 'desserts', name: 'Postres', icon: 'Cake' }
  ];

  const products = {
    appetizers: [
      {
        id: 'app1',
        name: 'Patatas Bravas',
        price: 8.50,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        description: 'Patatas fritas con salsa brava y alioli',
        popular: true
      },
      {
        id: 'app2',
        name: 'Jamón Ibérico',
        price: 15.00,
        image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
        description: 'Jamón ibérico de bellota cortado a mano'
      },
      {
        id: 'app3',
        name: 'Croquetas de Jamón',
        price: 9.00,
        image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
        description: 'Croquetas caseras de jamón serrano'
      },
      {
        id: 'app4',
        name: 'Pulpo a la Gallega',
        price: 12.50,
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
        description: 'Pulpo cocido con pimentón y aceite de oliva'
      }
    ],
    mains: [
      {
        id: 'main1',
        name: 'Paella Valenciana',
        price: 18.00,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        description: 'Paella tradicional con pollo, conejo y verduras',
        popular: true
      },
      {
        id: 'main2',
        name: 'Solomillo de Ternera',
        price: 22.00,
        image: 'https://images.pexels.com/photos/299347/pexels-photo-299347.jpeg',
        description: 'Solomillo a la plancha con salsa de vino tinto'
      },
      {
        id: 'main3',
        name: 'Bacalao al Pil Pil',
        price: 16.50,
        image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
        description: 'Bacalao confitado en aceite de oliva con ajo'
      },
      {
        id: 'main4',
        name: 'Cordero Asado',
        price: 20.00,
        image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-chop-veal-361184.jpeg',
        description: 'Cordero lechal asado con hierbas aromáticas'
      }
    ],
    beverages: [
      {
        id: 'bev1',
        name: 'Sangría de la Casa',
        price: 6.50,
        image: 'https://images.pexels.com/photos/5946071/pexels-photo-5946071.jpeg',
        description: 'Sangría tradicional con frutas frescas',
        popular: true
      },
      {
        id: 'bev2',
        name: 'Cerveza Estrella Galicia',
        price: 3.50,
        image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
        description: 'Cerveza rubia de barril'
      },
      {
        id: 'bev3',
        name: 'Vino Tinto Rioja',
        price: 4.80,
        image: 'https://images.pexels.com/photos/434311/pexels-photo-434311.jpeg',
        description: 'Copa de vino tinto D.O. Rioja'
      },
      {
        id: 'bev4',
        name: 'Agua Mineral',
        price: 2.50,
        image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg',
        description: 'Agua mineral natural con gas'
      }
    ],
    desserts: [
      {
        id: 'des1',
        name: 'Flan de la Abuela',
        price: 5.50,
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
        description: 'Flan casero con caramelo líquido',
        popular: true
      },
      {
        id: 'des2',
        name: 'Torrijas',
        price: 6.00,
        image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg',
        description: 'Torrijas tradicionales con canela'
      },
      {
        id: 'des3',
        name: 'Tarta de Santiago',
        price: 5.80,
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
        description: 'Tarta de almendra gallega'
      },
      {
        id: 'des4',
        name: 'Crema Catalana',
        price: 5.20,
        image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
        description: 'Crema catalana con azúcar quemado'
      }
    ]
  };

  const filteredProducts = products?.[selectedCategory]?.filter(product =>
    product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    product?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const popularProducts = Object.values(products)?.flat()?.filter(product => product?.popular);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header with Search */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-4 mb-4">
          <h2 className="text-lg font-semibold text-foreground">Catálogo de Productos</h2>
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        {/* Popular Items Quick Access */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground mr-2">Populares:</span>
          {popularProducts?.map((product) => (
            <Button
              key={product?.id}
              variant="outline"
              size="sm"
              onClick={() => onAddToOrder(product)}
              className="text-xs"
            >
              {product?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Category Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium
              restaurant-transition border-b-2
              ${selectedCategory === category?.id
                ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <Icon name={category?.icon} size={16} />
            <span className="hidden sm:inline">{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts?.map((product) => (
            <div
              key={product?.id}
              className="bg-card border border-border rounded-lg overflow-hidden restaurant-shadow-sm hover:restaurant-shadow-md restaurant-transition group cursor-pointer"
              onClick={() => onAddToOrder(product)}
            >
              {/* Product Image */}
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 restaurant-transition"
                />
                {product?.popular && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                    Popular
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-card/90 text-foreground text-sm font-semibold px-2 py-1 rounded">
                  €{product?.price?.toFixed(2)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                  {product?.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product?.description}
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  onClick={(e) => {
                    e?.stopPropagation();
                    onAddToOrder(product);
                  }}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No se encontraron productos
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;