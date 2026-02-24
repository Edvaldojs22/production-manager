package com.autoflex.production.controller;


import com.autoflex.production.entity.Product;
import com.autoflex.production.repository.ProductRepository;
import com.autoflex.production.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {
    @Autowired
    private ProductRepository repository;
    @Autowired
    private ProductionService productionService;

    @GetMapping
    public List<Product> getAll() {
        return repository.findAllByOrderByPriceDesc();
    }

    @PostMapping
    public Product create(@RequestBody Product product){

        if(product.getMaterials() != null){
            product.getMaterials().forEach(item -> item.setProduct(product) );
        }
        return  repository.save(product);
    }

    @GetMapping("{id}")
    public  Product getById(@PathVariable Long id){
        return  repository.findById(id).orElse(null);
    }

    @GetMapping("/suggest")
    public List<String> getSuggestion(){
        return  productionService.suggestProduction();
    }

}
