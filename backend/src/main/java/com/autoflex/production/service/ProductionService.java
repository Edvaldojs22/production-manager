package com.autoflex.production.service;

import com.autoflex.production.entity.Product;
import com.autoflex.production.entity.ProductMaterial;
import com.autoflex.production.entity.RawMaterial;
import com.autoflex.production.repository.ProductRepository;
import com.autoflex.production.repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductionService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private RawMaterialRepository rawMaterialRepository;

    public Product saveProduct(Product product) {
        if (product.getMaterials() != null) {
            product.getMaterials().forEach(m -> m.setProduct(product));
        }
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product with ID " + id + " not found"));
    }

    public List<Product> listAll() {
        return productRepository.findAllByOrderByPriceDesc();
    }

    public List<Map<String, Object>>suggestProduction() {
        List<Product> products = productRepository.findAllByOrderByPriceDesc();
        List<Map<String, Object>> suggestions = new ArrayList<>();

        Map<Long, Double> tempStock = rawMaterialRepository.findAll()
                .stream()
                .collect(Collectors.toMap(RawMaterial::getId, RawMaterial::getStockQuantity));
        for(Product product : products){
            int count = 0;
            boolean canProduce = true;

            while (canProduce){
                for(ProductMaterial pm : product.getMaterials()){
                    double needed = pm.getRequiredQuantity();
                    double available = tempStock.getOrDefault(pm.getRawMaterial().getId(),0.0);
                    if(available < needed){
                        canProduce = false;
                        break;
                    }
                }
                if(canProduce){
                    for (ProductMaterial pm : product.getMaterials()){
                        Long id = pm.getRawMaterial().getId();
                        tempStock.put(id, tempStock.get(id) - pm.getRequiredQuantity());

                    }
                    count++;
                }
            }
            if(count > 0 ){
                Map<String, Object> suggestion = new HashMap<>();
                suggestion.put("productName", product.getName());
                suggestion.put("quantity", count);
                suggestion.put("unitPrice", product.getPrice());
                suggestion.put("totalValue", count * product.getPrice());

                suggestions.add(suggestion);
            }
        }
        return  suggestions;
    }
}
