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

import java.util.*;
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

    public List<Map<String, Object>> suggestProduction() {
        List<Product> products = productRepository.findAllByOrderByPriceDesc();
        List<Map<String, Object>> suggestions = new ArrayList<>();


        Map<Long, Double> currentStock = rawMaterialRepository.findAll()
                .stream()
                .collect(Collectors.toMap(RawMaterial::getId, RawMaterial::getStockQuantity));

        for (Product product : products) {

            double maxProducible = Double.MAX_VALUE;
            boolean hasMaterials = !product.getMaterials().isEmpty();

            for (ProductMaterial pm : product.getMaterials()) {
                double needed = pm.getRequiredQuantity();
                double available = currentStock.getOrDefault(pm.getRawMaterial().getId(), 0.0);

                if (needed > 0) {

                    double possibleForThisMaterial = Math.floor(available / needed);


                    if (possibleForThisMaterial < maxProducible) {
                        maxProducible = possibleForThisMaterial;
                    }
                }
            }


            if (hasMaterials && maxProducible > 0 && maxProducible != Double.MAX_VALUE) {
                Map<String, Object> suggestion = new HashMap<>();
                suggestion.put("productName", product.getName());
                suggestion.put("quantity", (int) maxProducible);
                suggestion.put("unitPrice", product.getPrice());
                suggestion.put("totalValue", maxProducible * product.getPrice());

                suggestions.add(suggestion);
            }
        }
        return suggestions;
    }

    public Product updateProductMaterials(Long id, List<ProductMaterial> incomingMaterials) {
        Product product = findById(id);

        product.getMaterials().removeIf(existing ->
                incomingMaterials.stream().noneMatch(incoming ->
                        incoming.getRawMaterial().getId().equals(existing.getRawMaterial().getId())
                )
        );

        for (ProductMaterial newItem : incomingMaterials) {
            Optional<ProductMaterial> existingItem = product.getMaterials().stream()
                    .filter(m -> m.getRawMaterial().getId().equals(newItem.getRawMaterial().getId()))
                    .findFirst();
            if (existingItem.isPresent()) {
                existingItem.get().setRequiredQuantity(newItem.getRequiredQuantity());
            } else {

                newItem.setProduct(product);
                product.getMaterials().add(newItem);
            }
        }

        return productRepository.save(product);
    }

}
