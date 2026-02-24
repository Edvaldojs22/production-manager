package com.autoflex.production.service;

import com.autoflex.production.entity.Product;
import com.autoflex.production.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductionService {
    @Autowired
    private ProductRepository productRepository;

    public Product saveProduct(Product product){
        if(product.getMaterials() == null || product.getMaterials().isEmpty()){
            throw  new RuntimeException("Cannot create a product withou at least one raw material");
        }

        product.getMaterials().forEach( m -> m.setProduct(product));
        return  productRepository.save(product);
    }
}
